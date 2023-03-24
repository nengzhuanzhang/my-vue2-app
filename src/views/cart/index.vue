<template>
  <div class="cart-wrap">
    <van-nav-bar class="mb15" title="购物车" />
    <!-- 购物车列表 -->
    <div class="cart-list" v-if="cartList.length > 0">
      <van-checkbox-group v-model="selectProduct">
        <div class="cart-item" v-for="(item, index) in cartList" :key="item.id">
          <van-swipe-cell>
            <van-checkbox :name="item"></van-checkbox>
            <van-card
              tag="折扣"
              :price="item.price"
              :title="item.name"
              :thumb="item.image"
              @click="onProductDetail(item)"
            >
              <template #num>
                <van-stepper
                  v-model="item.count"
                  min="1"
                  @plus="plusNum(item.id)"
                  @minus="minusNum(item.id)"
                />
              </template>
            </van-card>
            <template #right>
              <van-button
                square
                text="删除"
                type="danger"
                class="delete-button"
                @click="onDeleteProduct(index, item)"
              />
            </template>
          </van-swipe-cell>
        </div>
      </van-checkbox-group>
    </div>
    <van-empty v-else description="暂无数据" />

    <!-- 提交订单 -->
    <van-submit-bar
      :price="totalPrice"
      button-text="提交订单"
      @submit="onSubmitOrder"
    >
      <van-checkbox v-model="selectAll" @click="handlSellAll"
        >全选</van-checkbox
      >
    </van-submit-bar>

    <TabBar :tabActive="tabActive"></TabBar>
  </div>
</template>

<script>
import {
  NavBar,
  Card,
  Stepper,
  Checkbox,
  CheckboxGroup,
  SubmitBar,
  Empty,
  Toast,
  SwipeCell,
  Button,
  Dialog,
} from "vant";
import TabBar from "../../components/TabBar.vue";
import { createOrder } from "../../api/order";

export default {
  name: "Home",
  components: {
    [NavBar.name]: NavBar,
    [Card.name]: Card,
    [Stepper.name]: Stepper,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [SubmitBar.name]: SubmitBar,
    [Empty.name]: Empty,
    [SwipeCell.name]: SwipeCell,
    [Button.name]: Button,
    [Dialog.name]: Dialog,
    TabBar,
  },
  watch: {
    selectProduct: {
      handler(newVal) {
        if (newVal.length == this.cartList.length) {
          this.selectAll = true;
        } else {
          this.selectAll = false;
        }
        // 总价计算
        this.comtalPrice();
      },
      deep: true,
    },
  },
  computed: {
    cartList() {
      return this.$store.state.cart.cartList;
    },
  },
  data() {
    return {
      tabActive: "cart",
      selectAll: false,
      totalPrice: 0,
      selectProduct: [],
    };
  },
  methods: {
    onProductDetail(item) {
      this.$router.push({
        path: "/product",
        query: { id: item.id },
      });
    },
    onDeleteProduct(index, item) {
      Dialog.confirm({
        title: "删除商品",
        message: "确认要删除商品吗",
      })
        .then(() => {
          this.$store.commit("cart/reduceCart", item);
        })
        .catch(() => {});
    },
    handlSellAll() {
      if (this.selectAll) {
        this.selectProduct = this.cartList;
      } else {
        this.selectProduct = [];
      }
    },
    comtalPrice() {
      let totalPrice = 0;
      this.selectProduct.map((item) => {
        totalPrice += item.price * item.count;
      });
      this.totalPrice = parseFloat(totalPrice) * 100;
    },
    onSubmitOrder() {
      if (this.selectProduct.length === 0) {
        Toast.fail("请选择需要结算的商品");
      } else {
        Toast.loading({
          duration: 3,
          forbidClick: true,
          message: "正在提交 3 秒",
        });

        createOrder({ list: this.selectProduct, totalPrice: this.totalPrice })
          .then((res) => {
            if (res.success) {
              Toast("下单成功");
              // 为了模拟当前订单信息，暂时存储该订单数据，订单列表获取该订单并展示
              //localStorage.setItem("curOrder", JSON.stringify(res.result));
              this.$router.push("/order");
            }
          })
          .catch(() => {});
      }
    },
    plusNum() {
      event.stopPropagation();
      this.$store.commit("cart/addCartCount");
    },
    minusNum() {
      this.$store.commit("cart/reduceCartCount");
      event.stopPropagation();
    },
  },
};
</script>
<style lang="scss" scoped>
.cart-wrap {
  .cart-list {
    .cart-item {
      background: #fff;
      padding: 10px 0px 10px 16px;
      border-bottom: 1px solid #ededed;
      .van-card {
        margin: 0 !important;
        padding-right: 5px;
        flex: 1;
        background: #fff;
        .van-card__content {
          text-align: left;
          padding-right: 10px;
        }
      }
    }
  }
  .van-submit-bar {
    position: fixed;
    bottom: 100px;
  }
  ::v-deep .van-checkbox-group {
    .van-button--danger {
      width: 100%;
      height: 100%;
    }
  }
  ::v-deep.van-swipe-cell {
    .van-swipe-cell__wrapper {
      display: flex;
      justify-content: flex-start;
    }
  }
}
</style>
