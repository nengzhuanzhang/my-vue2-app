<template>
  <div class="order-list-wrap">
    <div class="order-list" v-if="dataList.length > 0">
      <div class="order-item" v-for="item in dataList" :key="item.orderId">
        <div class="order-item-detail">
          <div class="order-info">
            <span class="order-id">{{ item.orderId }}</span>
            <span class="order-stauts">{{
              orderStatusToText(item.status)
            }}</span>
          </div>
          <van-card
            class="mb15"
            v-for="product in item.list"
            :key="product.id"
            :price="product.price"
            :title="product.name"
            :thumb="product.image"
          >
          </van-card>
          <div class="order-time">
            <span>{{ item.createTime }}</span>
            <span class="total-price-wrap"
              >总价：<span class="total-price"
                >￥{{ item.totalPrice ? item.totalPrice : 0.0 }}</span
              ></span
            >
          </div>
        </div>
      </div>
    </div>
    <van-empty v-else description="暂无数据" />
  </div>
</template>

<script>
import { Card, Empty } from "vant";

export default {
  components: {
    [Card.name]: Card,
    [Empty.name]: Empty,
  },
  props: {
    dataList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    orderStatusToText(stauts) {
      let text = "";
      switch (stauts) {
        case "1":
          text = "交易成功";
          break;
        case "2":
          text = "待付款";
          break;
        default:
          text = "交易成功";
          break;
      }
      return text;
    },
  },
};
</script>

<style scoped lang="scss">
.order-list-wrap {
  .order-list {
    .order-item {
      padding: 16px 20px;
      background: $white;
      .van-card {
        padding-right: 5px;
        flex: 1;
        .van-card__content {
          text-align: left;
          padding-right: 10px;
        }
      }
      .order-item-detail {
        .order-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          .order-id {
            font-size: 24px;
            font-weight: 500;
            color: $font-color;
          }
          .order-stauts {
            font-size: 24px;
            color: $red;
            font-weight: 500;
          }
        }
        .order-time {
          display: flex;
          justify-content: space-between;
          .total-price-wrap {
            font-weight: 600;
            .total-price {
              color: $red;
              font-size: 28px;
            }
          }
        }
      }
    }
  }
}
</style>
