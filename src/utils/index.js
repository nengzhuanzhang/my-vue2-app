export function downLoad(res, name) {
  var blob = new Blob([res]);
  var downloadElement = document.createElement("a");
  var href = window.URL.createObjectURL(blob); // 创建下载的链接
  downloadElement.href = href;
  downloadElement.download = name; // 下载后文件名
  document.body.appendChild(downloadElement);
  downloadElement.click(); // 点击下载
  document.body.removeChild(downloadElement); // 下载完成移除元素
  window.URL.revokeObjectURL(href); // 释放掉blob对象
}

export function objToUrlQuery(obj) {
  if (!obj) {
    return "";
  }
  let keysArr = Object.keys(obj);
  if (obj.length <= 0) {
    return "";
  }
  let val = keysArr.map((key) => `${key}=${obj[key]}&`);
  val = val.join("");
  val = val.substr(0, val.length - 1);
  val = "?" + val;
  return val;
}

export function isWeChat() {
  const ua = window.navigator.userAgent.toLowerCase();
  if (
    ua.match(/MicroMessenger/i) &&
    ua.match(/MicroMessenger/i)[0] === "micromessenger"
  ) {
    return true;
  } else {
    return false;
  }
}
