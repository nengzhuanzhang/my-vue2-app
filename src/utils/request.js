import axios from "axios";
import { Toast } from "vant";
import store from "../store";

// request response 解析
/**
 * @param axiosResponse axios 的返回，axios 会将 200 - 300 的处理为 reponse
 * @param axiosError axios 的 err 对象，axios 会将 400 以上或其他的错误的处理为 error
 * @return response { success: boolean, error: { errorType: string, errorCode: string, errorMessage: string, errorDetail: any }, result: { success:boolean, errorCode: string, errorDesc: string, result: any }}
 */
function parseAxiosResponse(axiosResponse, axiosError) {
  const response = {
    // 调用是否成功
    success: false,
    // 调用错误，不成功时有
    error: null,
    // 调用结果，对应后台的 resultbean，是否成功都可能存在
    result: null,
  };
  // 存在 response 调用必然成功
  if (axiosResponse) {
    response.success = true;
    response.result = axiosResponse.data;
    return response;
  }

  // error 存在需要区分
  if (axiosError) {
    // 目的是分离错误，将正常的应用错误分离出来，处理为正确的调用
    response.success = false;

    const errorResponse = axiosError.response;
    if (!errorResponse) {
      // 处理网络或超时
      const isNetworkError =
        typeof axiosError === "object" &&
        axiosError.toString().indexOf("Network Error") >= 0;
      if (isNetworkError) {
        const isNavigatorOffline =
          window.navigator && window.navigator.onLine === false;
        response.error = {
          errorCode: "NetworkError",
          errorMessage: isNavigatorOffline
            ? "网络连接错误，请检查网络连接"
            : "网络连接错误，无法请求服务",
        };
        return response;
      }

      const isTimeoutError =
        typeof axiosError === "object" &&
        axiosError.toString().indexOf("Timeout Error") >= 0;
      if (isTimeoutError) {
        response.error = {
          errorCode: "TimeoutError",
          errorMessage: "网络请求超时，请稍后重试",
        };
        return response;
      }
    }

    let statusCode = errorResponse.status;
    let statusIsError = statusCode && statusCode >= 400;

    if (!statusIsError) {
      // 不应当不是失败
      console.error(
        "无法处理的 AxiosError，请检查代码逻辑和服务器返回内容",
        axiosResponse,
        axiosError
      );
      throw new Error(
        "无法处理的返回，请检查控制台输出，核对代码逻辑和服务器返回内容"
      );
    }

    let errorCode = errorResponse.data && errorResponse.data.errorCode;
    if (!errorCode) {
      response.error = {
        errorCode: statusCode >= 400 ? "RequestError" : "ServerError",
        errorMessage: errorResponse.statusText,
      };
      return response;
    }

    response.success = true;
    response.result = errorResponse.data;
    return response;
  }
}

/**
 * 展示错误信息
 * @param msg
 */
function popupErrorMessage(msg) {
  Toast({
    message: msg,
    type: "fail",
    duration: 5 * 1000,
  });
}

// 默认时间为 1m
const axiosConfig = {
  timeout: 60 * 1000,
  timeoutErrorMessage: "Timeout Error",
};

/**
 * 基于 axios，发送请求，发生网络或系统错误必然 reject。
 * 默认超时 60s。
 * @param url
 * @param data
 * @param method 默认 post
 * @param showErrorMessage 当自动处理错误请求的时候，遇到错误是否弹出提示信息框
 * @param rejectOnFailedResult 发生业务错误的时候，是否 reject
 * @param others 其他 axios 配置
 * @param systemCode 系统编码，默认为本系统，影响 baseUrl
 * @return {Promise<{success: boolean, errorCode: string, errorDesc: string, result: any}>}
 */
export default async function request({
  url,
  data = {},
  method = "post",
  showErrorMessage = true,
  rejectOnFailedResult = true,
  ...others
}) {
  const config = {
    baseURL: process.env.VUE_APP_BASE_API,
    url,
    method,
    ...axiosConfig,
    ...others,
  };

  const accessToken = store.getters.token || "";
  if (!accessToken) {
    axios.defaults.headers.common["X-AccessToken"] = accessToken;
  }

  if (method === "get") {
    config.params = data;
  } else {
    config.data = data;
  }

  // 处理 axios 逻辑，此处集中处理了结果解析、错误拦截处理
  let response = null;
  try {
    const res = await axios.request(config);
    response = parseAxiosResponse(res, null);
  } catch (err) {
    response = parseAxiosResponse(null, err);
  }

  if (response.success) {
    const result = response.result;
    if (result.success) {
      return Promise.resolve(result);
    }

    // 登录，肯定要拦截
    if (result.errorCode === "00-00-000007") {
      store.dispatch("user/logout", window.vue);
      popupErrorMessage("登录超时，请重新登录");
      return Promise.reject(result);
    }

    // 其他情况，如果要求不拦截，则返回
    if (!rejectOnFailedResult) {
      return Promise.resolve(result);
    }

    // 其他情况，根据参数拦截
    if (showErrorMessage) {
      popupErrorMessage(result.errorDesc || "请求失败，请检查操作后重试");
    }

    return Promise.reject(result);
  }

  // 如果失败
  if (showErrorMessage) {
    popupErrorMessage(response.error.errorMessage);
  }
  return Promise.reject(response);
}
