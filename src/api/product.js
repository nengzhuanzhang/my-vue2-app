import request from "@/utils/request";

// 查询列表
export function queryProductList(params) {
  return request({
    url: `/api/product/list?pageNo=${params.pageNo}&pageSize=${params.pageSize}`,
    method: "get",
  });
}

export function queryProductDetail(id) {
  return request({
    url: `/api/queryProductDetail`,
    method: "post",
    data: { id: id },
  });
}
