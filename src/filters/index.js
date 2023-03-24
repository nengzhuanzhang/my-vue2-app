//人名密文显示
export function asSecretPwd(name) {
  if (!name) {
    return "**";
  }
  let arr = Array.from(new Array(name.length).keys()).fill("*");
  arr[0] = name.substr(0, 1);
  return arr.join("");
}

//电话号码密文显示
export function asPwdPhone(phone) {
  if (!phone) {
    return "--";
  }
  return phone.substring(0, 3) + "****" + phone.substring(phone.length - 4);
}
