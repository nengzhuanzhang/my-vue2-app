<template>
  <div class="goods-wrap">
    <ProductList :dataList="dataList"></ProductList>
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
  props: {
    searchVal: {
      type: String,
    },
  },
  data() {
    return {
      dataList: [],
    };
  },
  created() {
    this.queryDataList();
  },
  methods: {
    queryDataList() {
      let params = {
        searchVal: this.searchVal,
      };
      queryProductList(params)
        .then((res) => {
          this.dataList = res.result;
          // 模拟搜索：此处属于前端过滤数据
          if (this.searchVal) {
            let filterDataList = this.dataList.filter(
              (item) => item.name.indexOf(this.searchVal) != -1
            );
            this.dataList = filterDataList;
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
