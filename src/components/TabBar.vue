<template>
  <van-tabbar v-model="curTabActive">
    <van-tabbar-item replace to="/home" name="home" icon="home-o"
      >首页</van-tabbar-item
    >
    <van-tabbar-item replace to="/cart" name="cart" icon="shopping-cart-o"
      >购物车</van-tabbar-item
    >
    <van-tabbar-item replace to="/my" name="my" icon="user-o"
      >我的</van-tabbar-item
    >
  </van-tabbar>
</template>
<script>
import { Tabbar, TabbarItem } from "vant";

export default {
  name: "Home",
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
  },
  props: {
    tabActive: {
      type: String,
      default: "home",
    },
  },
  data() {
    return {
      curTabActive: this.tabActive,
    };
  },
  created() {},
  methods: {},
};
</script>
<style lang="scss" scoped></style>
