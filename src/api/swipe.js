import request from "@/utils/request";

export function querySwipeList() {
  return request({
    url: "/api/swipeList",
    method: "get",
  });
}
