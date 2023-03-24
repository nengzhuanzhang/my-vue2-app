<template>
  <div class="order-wrap">
    <van-nav-bar
      class="mb15"
      left-arrow
      title="订单列表"
      @click-left="onClickLeft"
    />
    <div>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :imediate-check="false"
        :offset="50"
        @load="queryDataList"
      >
        <Orderlist :dataList="dataList"></Orderlist>
      </van-list>
    </div>
  </div>
</template>

<script>
import { NavBar, List, Toast } from "vant";
import { queryOrderList } from "../../api/order";
import Orderlist from "./orderList.vue";

export default {
  name: "Home",
  components: {
    [NavBar.name]: NavBar,
    [List.name]: List,
    Orderlist,
  },
  data() {
    return {
      dataList: [],
      loading: false,
      finished: false,
      pageNo: 1,
      pageSize: 10,
      totalConut: 0,
    };
  },
  created() {},
  methods: {
    onClickLeft() {
      this.$router.push("/home");
    },
    queryDataList() {
      Toast.loading({
        message: "加载中...",
        duration: 0, // 持续展示 toast
        forbidClick: true,
      });
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };
      queryOrderList(params)
        .then((res) => {
          Toast.clear();
          this.pageNo++;
          this.dataList = this.dataList.concat(res.result);
          this.totalConut = res.totalCount;
          // 加载状态结束
          this.loading = false;
          // 数据全部加载完成
          if (this.dataList.length >= this.totalConut) {
            this.finished = true;
          } else {
            this.finished = false;
          }
        })
        .catch(() => {
          Toast.clear();
        });
    },
  },
};
</script>
<style lang="scss" scoped></style>
