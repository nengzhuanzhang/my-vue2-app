const fetch = require("node-fetch");
const _ = require("lodash");
const fs = require("fs");
let path = require("path");

const systemUrl = "http://localhost:8081";

let eq = (a, b) => a === b;
let decapitalize = (s) => {
  if (!s) {
    return s;
  }
  return s[0].toLowerCase() + s.substr(1);
};
let capitalize = (s) => {
  if (!s) {
    return s;
  }
  return s[0].toUpperCase() + s.substr(1);
};
let pathDirname = (s) => {
  if (!s) {
    return s;
  }
  return require("path").dirname(s);
};
let pathBaseName = (s) => {
  if (!s) {
    return s;
  }
  return require("path").basename(s);
};

/**
 * @typedef {Object} MethodDef
 * @property {string} name - name
 * @property {string} description - description
 */

/**
 * @typedef {Object} HttpDef
 * @property {string} url - url
 * @property {string} method - method
 */

/**
 * @typedef {Object} PropDef
 * @property {string} type - type
 * @property {string} name - name
 * @property {string} description - description
 */

/**
 * @typedef {Object} TypeDef
 * @property {string} name - name
 * @property {string} description - description
 * @property {Array<PropDef>} props - prop list
 */

/**
 * @typedef {Object} SnippetVO
 * @property {TypeDef} paramType - paramType
 * @property {TypeDef} resultType - resultType
 * @property {MethodDef} method - method
 * @property {HttpDef} http - http
 */

/**
 * 渲染 hbs
 * @param {SnippetVO} snippetVO
 * @return {string}
 */
function renderApiSnippets(snippetVO) {
  const Handlebars = require("handlebars");
  const source = fs
    .readFileSync(path.join(__dirname, "templates/api_snippets.js.hbs"))
    .toString();
  Handlebars.registerHelper("eq", eq);
  let template = Handlebars.compile(source);
  const result = template(snippetVO);
  return result;
}

// 处理泛型在 swagger 中的表达，如：PageDTO«OrgDTO»
const simpleConvertKey = (k) => {
  return k.replace(/«([^»]+)»/, "Of$1");
};
function parseSwaggerDefinition({ key, type, description, properties, items }) {
  let props = [];
  const simpleConvertType = (t) => {
    if (t === "integer") {
      return "number";
    }
    return simpleConvertKey(t);
  };
  // 直接递归构建 string
  if (type === "object") {
    _.keys(properties).map((pk) => {
      const p = properties[pk];
      const pProps = parseSwaggerDefinition({
        ...p,
        key: pk,
      });
      if (pProps.length > 1) {
        props.push(pProps);
      } else {
        props.push(...pProps);
      }
    });
  } else if (type === "array" && items) {
    // 这里涉及到一个递归的问题
    const refDefinitionKey = getDefinitionKey(items);
    if (!refDefinitionKey) {
      props.push({
        name: simpleConvertKey(key),
        type: `Array<${simpleConvertType(items.type)}>`,
        description: description || "",
      });
    } else {
      // array<xxObject>
      embeddedTypes.add(refDefinitionKey);
      props.push({
        name: simpleConvertKey(key),
        type: `Array<${simpleConvertKey(refDefinitionKey)}>`,
        description: description || "",
      });
    }
  } else {
    props.push({
      name: simpleConvertKey(key),
      type: simpleConvertType(type),
      description: description || "",
    });
  }

  return props;
}

let getSwaggerJson = (baseUrl) =>
  fetch(baseUrl + "/v2/api-docs").then((request) => {
    return request.json();
  });
let interactiveFindPath = (pathText, swaggerJson) => {
  const result = swaggerJson;
  // 获取 swagger 定义
  const path = pathText;

  let paths = result.paths;
  paths = _.keys(paths).map((p) => {
    return {
      key: p,
      value: paths[p],
    };
  });

  // console.log(paths);
  // console.log(path);
  const matchedPaths = paths.filter((p) => p.key.indexOf(path) >= 0);

  // 重组
  const apis = _.flatten(
    matchedPaths.map((p) => {
      const k = p.key;
      const values = p.value;
      const methods = _.keys(values);
      return methods.map((m) => {
        return {
          key: m + " " + k,
          value: values[m],
        };
      });
    })
  );

  if (apis.length === 0) {
    return Promise.resolve([result, null]);
  }
  if (apis.length === 1) {
    return Promise.resolve([result, apis[0]]);
  }

  const inqurier = require("inquirer");
  const choices = apis.map((p, i) => {
    return { name: p.key + " " + p.value.summary, value: i };
  });
  return inqurier
    .prompt([
      {
        name: "index",
        type: "list",
        choices: choices,
        message: "匹配到多个 api，选择一个",
        loop: false,
      },
    ])
    .then((answers) => {
      const index = answers.index;
      const api = apis[index];
      console.log("selected api: ", api.key);

      return Promise.resolve([result, api]);
    });
};

const embeddedTypes = new Set();
const getMethodDef = (swagger, api) => {
  // console.log(api);
  const url = api.key.split(" ")[1];
  const apiMethod = _.camelCase(_.slice(url.split("/"), -2).join(" "));
  const desc = api.value.description || api.value.summary;

  return {
    name: apiMethod,
    description: desc,
  };
};
const getHttpDef = (swagger, api) => {
  return {
    url: api.key.split(" ")[1],
    method: api.key.split(" ")[0],
  };
};
const getTypeDef = (swagger, definitionKey) => {
  const definition = swagger.definitions[definitionKey];

  const props = parseSwaggerDefinition({
    key: definitionKey,
    ...definition,
  });

  return {
    name: simpleConvertKey(definitionKey),
    description: definition.description,
    props: props,
  };
};

function getSnippetVO(swagger, api) {
  if (!api) {
    throw new Error("无法找到符合要求的 api");
  }
  const methodDef = getMethodDef(swagger, api);
  const httpDef = getHttpDef(swagger, api);
  const bodyParamKey = getBodyParamKey(api.value.parameters);
  const bodyParamType = bodyParamKey && getTypeDef(swagger, bodyParamKey);
  // console.log(JSON.stringify(bodyParamType));
  const resultParamKey = getOKResultBeanType(api.value.responses);
  const resultParamType = getTypeDef(swagger, resultParamKey);
  // console.log(resultParamType);

  const extraTypes = [];
  if (embeddedTypes.size > 0) {
    embeddedTypes.forEach((e) => {
      extraTypes.push(getTypeDef(swagger, e));
    });
  }

  return {
    paramType: bodyParamType,
    resultType: resultParamType,
    method: methodDef,
    http: httpDef,
    extraTypes,
  };
}

let querySwaggerApiDef = function (data) {
  getSwaggerJson(systemUrl)
    .then((result) => {
      return interactiveFindPath(data.apiName, result);
    })
    .then(([swagger, api]) => {
      if (!api) {
        console.log("无法查到相关接口");
        return;
      }

      return Promise.resolve(getSnippetVO(swagger, api));
    })
    .then((result) => {
      let jsdoc = renderApiSnippets(result);
      console.log(jsdoc);

      const clipboardy = require("clipboardy");
      clipboardy.writeSync(jsdoc);

      console.log("已复制到粘贴板");
    });
};

let getDefinitionKey = (refObject) => {
  if (refObject && refObject["$ref"]) {
    return getRefDefinitionKey(refObject["$ref"]);
  }
  return null;
};
let getRefDefinitionKey = (ref) => {
  return ref.replace("#/definitions/", "");
};

let getBodyParam = (parameters) => {
  return _.find(parameters, (p) => p.in === "body");
};
let getBodyParamKey = (parameters) => {
  const bodyParam = getBodyParam(parameters);
  if (!bodyParam) {
    return null;
  }

  let paramSchema = bodyParam.schema["$ref"];
  if (!paramSchema) {
    return null;
  }
  const definition = paramSchema.replace("#/definitions/", "");
  return definition;
};

let getOkResponse = (response) => {
  if (response && response["200"]) {
    return response["200"];
  }
  return null;
};
let getResultBeanType = (ref) => {
  let schema = ref.replace("#/definitions/", "");
  // 处理 ResultBean，这部分会手动配合 jsdoc 处理
  if (schema.indexOf("ResultBean«") >= 0 && schema.endsWith("»")) {
    schema = schema.slice("ResultBean«".length, schema.length - 1);
  }

  return schema;
};
let getOKResultBeanType = (response) => {
  var okResponse = getOkResponse(response);
  if (!okResponse) {
    throw new Error("不存在 200 Response 说明，无法处理");
  }
  let schema = getResultBeanType(okResponse.schema["$ref"]);
  return schema;
};

module.exports = function (plop) {
  plop.setHelper("decapitalize", decapitalize);
  plop.setHelper("capitalize", capitalize);
  plop.setHelper("pathDirname", pathDirname);
  plop.setHelper("pathBaseName", pathBaseName);

  plop.setActionType("querySwaggerApiDef", querySwaggerApiDef);

  plop.setGenerator("api", {
    description: "打印 axios api 接口(仅支持规范的 POST 请求！)",
    prompts: [
      {
        type: "input",
        name: "apiName",
        message: "api 路径关键字，如 user, usr/user",
      },
    ],
    actions() {
      return [
        {
          type: "querySwaggerApiDef",
        },
      ];
    },
  });

  plop.setGenerator("view", {
    description: "生成 vue 页面",
    prompts: [
      {
        type: "input",
        name: "viewName",
        message:
          "页面名(包含路径，如 login/index 生成 views/login/index.vue 页面)",
      },
    ],
    actions() {
      return [
        {
          type: "add", //
          skipIfExists: true,
          path: `src/views/{{pathDirname viewName}}/{{pathBaseName viewName}}.vue`, // 要生成的文件路径
          templateFile: "templates/vue_components.vue.hbs", //
        },
      ];
    },
  });
};
