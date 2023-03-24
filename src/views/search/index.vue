<template>
  <div class="home-wrap">
    <van-nav-bar
      class="mb15"
      title="搜索"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-search
      class="mb15"
      v-model="searchVal"
      @search="onSearch"
      @cancel="onCancel"
      show-action
      placeholder="请输入搜索商品名"
    />

    <ProductItem ref="productList" :searchVal="searchVal"></ProductItem>
  </div>
</template>

<script>
import { Search, NavBar } from "vant";
import ProductItem from "./productItem.vue";

export default {
  name: "Home",
  components: {
    [Search.name]: Search,
    [NavBar.name]: NavBar,
    ProductItem,
  },
  data() {
    return {
      searchVal: "",
    };
  },
  created() {},
  methods: {
    onClickLeft() {
      this.$router.push("/home");
    },
    onSearch() {
      this.$refs.productList.queryDataList();
    },
    onCancel() {
      this.$refs.productList.queryDataList();
    },
  },
};
</script>
<style lang="scss" scoped></style>
