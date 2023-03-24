import request from "@/utils/request";

export function createOrder(params) {
  return request({
    url: `/api/createOrder`,
    method: "post",
    data: params,
  });
}

export function queryOrderList(params) {
  return request({
    url: `/api/queryOrder`,
    method: "post",
    data: params,
  });
}
