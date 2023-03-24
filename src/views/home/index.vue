<template>
  <div class="home-wrap">
    <van-search
      class="mb15"
      @focus="jumpSearchPage"
      placeholder="请输入搜索关键词"
    />
    <van-swipe class="my-swipe mb15" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="item in swipeList" :key="item.id">
        <div
          class="swipe-image"
          :style="`background-image:url(${item.image})`"
        ></div>
      </van-swipe-item>
    </van-swipe>

    <ProductItem></ProductItem>
    <TabBar :tabActive="tabActive"></TabBar>
  </div>
</template>

<script>
import { Search, Swipe, SwipeItem } from "vant";
import TabBar from "../../components/TabBar.vue";
import ProductItem from "./productItem.vue";
import { querySwipeList } from "../../api/swipe";

export default {
  name: "Home",
  components: {
    [Search.name]: Search,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    TabBar,
    ProductItem,
  },
  data() {
    return {
      tabActive: "home",
      swipeList: [],
    };
  },
  created() {
    this.queryDataList();
  },
  methods: {
    queryDataList() {
      querySwipeList().then((res) => {
        this.swipeList = res.result;
      });
    },
    jumpSearchPage() {
      this.$router.push("/search");
    },
  },
};
</script>
<style lang="scss" scoped>
.my-swipe {
  margin: 0 20px 20px;
  border-radius: 8px;
  .van-swipe-item {
    color: #fff;
    font-size: 20px;
    height: 400px;
    line-height: 400px;
    text-align: center;
    background-color: $white;
    .swipe-image {
      width: 100%;
      height: 400px;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
    }
  }
}
</style>
