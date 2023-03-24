<template>
  <div class="my-wrap">
    <van-nav-bar title="我的" />
    <van-cell class="personal-info">
      <template #title>
        <div class="flex-start">
          <img
            class="img-avatar"
            src="../../assets/user-avatar-man.png"
            alt=""
          />
          <h3 class="person-name">{{ userName }}</h3>
        </div>
      </template>
    </van-cell>
    <div class="menu-wrap">
      <van-cell
        class="flex-start mb15"
        v-for="(item, index) in menuList"
        :key="index"
        :title="item.name"
        :icon="item.icon"
        is-link
        :class="item.borderNone ? 'border-none' : ''"
        @click="handleJump(item)"
      ></van-cell>
      <van-cell
        class="flex-start text-center"
        title="退出登录"
        @click="onLoginOut"
      ></van-cell>
    </div>
    <TabBar :tabActive="tabActive"></TabBar>
  </div>
</template>

<script>
import { NavBar, Icon, Cell } from "vant";
import TabBar from "../../components/TabBar.vue";

export default {
  name: "My",
  components: {
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
    [Cell.name]: Cell,
    TabBar,
  },
  watch: {},
  data() {
    return {
      tabActive: "my",
      userName: localStorage.getItem("userName"),
      menuList: [
        {
          icon: "notes-o",
          name: "我的订单",
          pageName: "order",
          borderNone: true, // 根据该属性 绑定样式，border-bottom:none
        },
        // {
        //   icon: "setting-o",
        //   name: "设置",
        //   pageName: "setting",
        //   borderNone: true, // 根据该属性 绑定样式，border-bottom:none
        // },
      ],
    };
  },
  computed: {},
  created() {},
  destroyed() {},
  methods: {
    handleJump(item) {
      if (item.pageName === "order") {
        this.$router.push("/order");
      }
    },
    onLoginOut() {
      localStorage.removeItem("userName");
      this.$router.push("/login");
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/vant-reset.scss";
.my-wrap {
  .personal-info {
    margin: 20px 0;
    align-items: center;
    border-bottom: none;
    @include box-shadow();
    .img-avatar {
      margin-right: 10px;
      width: 136px;
    }
    .person-name {
      font-size: $font-size-medium-x;
      color: $black;
      font-weight: bold;
    }
  }
  .menu-wrap {
    .border-none {
      border-bottom: none;
    }
    @include box-shadow();
  }
}
.van-cell {
  &.text-center {
    border-bottom: none;
    .van-cell__title {
      text-align: center;
    }
  }
}
</style>
