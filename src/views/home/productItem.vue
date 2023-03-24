<template>
  <div class="goods-wrap">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :imediate-check="false"
      :offset="50"
      @load="queryDataList"
    >
      <ProductList :dataList="dataList"></ProductList>
    </van-list>
  </div>
</template>

<script>
import { List } from "vant";
import { queryProductList } from "../../api/product";
import ProductList from "../../components/productList.vue";

export default {
  components: {
    [List.name]: List,
    ProductList,
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
    queryDataList() {
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };
      queryProductList(params)
        .then((res) => {
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
        .catch(() => {});
    },
    onDetail(item) {
      this.$router.push({
        path: "/product",
        query: { id: item.id },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.goods-wrap {
  margin-bottom: 100px;
}
</style>
