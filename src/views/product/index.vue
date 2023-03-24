<template>
  <div class="product-detail-wrap">
    <van-nav-bar
      class="mb15"
      left-arrow
      fixed
      title="商品详情"
      @click-left="onClickLeft"
    />
    <div class="product-content-wrap">
      <!-- 图片 -->
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item>
          <div
            class="product-image"
            :style="`background-image:url(${productInfo.image})`"
          ></div>
        </van-swipe-item>
      </van-swipe>
      <!-- 价格信息 -->
      <div class="product-info">
        <div class="price-wrap">
          <span class="new-price">￥{{ productInfo.price }}</span>
          <span class="old-price">
            <del>￥{{ productInfo.oldPrice }}</del>
          </span>
        </div>
        <h3 class="title">{{ productInfo.name }}</h3>
      </div>

      <!-- 推荐商品 -->
      <div class="recommend-product-wrap">
        <h3 class="recommend-title">推荐商品</h3>
        <ProductList :dataList="productInfo.recommendList"></ProductList>
      </div>
    </div>

    <!-- 加入购物车 -->
    <van-goods-action>
      <van-goods-action-icon
        icon="cart-o"
        :badge="cartNum"
        text="购物车"
        @click="$router.push('/cart')"
      />
      <van-goods-action-button
        type="warning"
        text="加入购物车"
        @click="addCart"
      />
      <van-goods-action-button type="danger" text="立即购买" @click="buyNow" />
    </van-goods-action>
  </div>
</template>

<script>
import {
  NavBar,
  Swipe,
  SwipeItem,
  Toast,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
} from "vant";
import { queryProductDetail } from "../../api/product";
import ProductList from "../../components/productList.vue";

export default {
  name: "Home",
  components: {
    [NavBar.name]: NavBar,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [GoodsAction.name]: GoodsAction,
    [GoodsActionIcon.name]: GoodsActionIcon,
    [GoodsActionButton.name]: GoodsActionButton,
    ProductList,
  },
  watch: {
    "$route.query.id": {
      handler(newVal, oldVal) {
        if (newVal != oldVal) {
          this.queryDetail();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    cartNum() {
      return this.$store.state.cart.cartCount
        ? this.$store.state.cart.cartCount
        : 0;
    },
  },
  data() {
    return {
      productInfo: {},
      // cartNum: 0,
    };
  },
  created() {
    this.queryDetail();
  },
  methods: {
    onClickLeft() {
      this.$router.push("/home");
    },
    queryDetail() {
      Toast.loading({
        message: "加载中...",
        duration: 0, // 持续展示 toast
        forbidClick: true,
      });
      queryProductDetail(this.$route.query.id)
        .then((res) => {
          Toast.clear();
          if (res.success && res.result) {
            this.productInfo = res.result;
          } else {
            Toast("该商品不存在");
          }
        })
        .catch(() => {
          Toast.clear();
        });
    },
    addCart() {
      console.log("addCart:", this.$store);
      this.$store.commit("cart/addCart", {
        ...this.productInfo,
        count: 1,
      });
    },
    buyNow() {
      // TODO 跳转 订单结算页面
      this.$router.push("/order");
    },
  },
};
</script>
<style lang="scss" scoped>
.product-detail-wrap {
  margin-bottom: 160px;
  .product-content-wrap {
    margin-top: 100px;
    .my-swipe {
      .van-swipe-item {
        color: #fff;
        font-size: 20px;
        line-height: 750px;
        text-align: center;
        background-color: $white;
        .product-image {
          width: 100%;
          height: 750px;
          background-repeat: no-repeat;
          background-position: center center;
          background-size: cover;
        }
      }
    }
    .product-info {
      margin: 16px;
      padding: 20px 24px;
      background: $white;
      @include box-shadow();
      border-radius: 8px;
      text-align: left;
      .price-wrap {
        .new-price {
          margin-right: 20px;
          font-size: 40px;
          font-weight: 600;
          color: red;
        }
        .old-price {
          font-size: 28px;
          color: #ddd;
        }
      }
      .title {
        margin: 16px auto 10px;
        font-size: 26px;
        @include no-wrap-multi(2);
      }
    }
    .recommend-product-wrap {
      margin: 16px;
      padding: 20px 0;
      background: $white;
      @include box-shadow();
      border-radius: 8px;
      .recommend-title {
        margin: 10px 20px 20px 16px;
        font-size: 26px;
        text-align: left;
      }
    }
  }
}
</style>
