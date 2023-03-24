<template>
  <div class="goods-item">
    <div
      class="item"
      v-for="item in dataList"
      :key="item.id"
      @click="onDetail(item)"
    >
      <div class="item-detail">
        <img :src="item.image" alt="" />
        <div class="desc">
          {{ item.name }}
        </div>
        <div class="price">
          <span class="new-price">￥{{ item.price }}</span>
          <span class="old-price">
            <del>￥{{ item.oldPrice }}</del>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
.goods-item {
  margin: 0 auto;
  column-count: 2;
  column-gap: normal;
  width: 94%;
  .item {
    break-inside: avoid;
    margin-bottom: 20px;
    background: #fff;
    border: 1px solid #ededed;
    border-radius: 8px;
    .item-detail {
      width: 100%;
      img {
        width: 100%;
        height: 280px;
        vertical-align: middle;
        border-top-right-radius: 8px;
        border-top-left-radius: 8px;
      }
      .desc {
        margin: 18px 10px 24px;
        font-size: 24px;
        color: $font-color;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .price {
        margin: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .new-price {
          font-size: 32px;
          font-weight: 600;
          color: red;
        }
        .old-price {
          font-size: 24px;
          color: #ddd;
        }
      }
    }
  }
}
</style>
