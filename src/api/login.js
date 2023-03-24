import request from "@/utils/request";

// login
export function login(params) {
  return request({
    url: "/api/login",
    method: "post",
    data: params || {},
  });
}
