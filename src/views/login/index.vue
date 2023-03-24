<template>
  <div class="login-wrap">
    <div class="form-wrap">
      <h2 class="title">登 录</h2>
      <van-form @submit="onSubmit">
        <van-field
          v-model="username"
          name="用户名"
          placeholder="用户名"
          left-icon="friends-o"
          :rules="[{ required: true, message: '请填写用户名' }]"
        >
        </van-field>
        <van-field
          v-model="password"
          type="password"
          name="密码"
          placeholder="密码"
          left-icon="medal-o"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div class="btn-wrap">
          <van-button round block type="info" native-type="submit"
            >登录</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { Form, Field, Button, Toast } from "vant";
import { login } from "../../api/login";

export default {
  name: "Home",
  components: {
    [Form.name]: Form,
    [Field.name]: Field,
    [Button.name]: Button,
  },
  data() {
    return {
      username: "18358332834",
      password: "123456",
    };
  },
  created() {},
  methods: {
    onSubmit() {
      login({ username: this.username, password: this.password }).then(
        (res) => {
          if (res.success && res.result) {
            Toast("登录成功");
            localStorage.setItem("userName", res.result.username);
            this.$router.push("/home");
          } else {
            Toast("用户名或者密码错误");
          }
        }
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100vh;
  background: url("../../assets/login-back.jpg") no-repeat center center;
  background-size: cover;
  .form-wrap {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0 auto;
    width: 580px;
    background: #fff;
    border-radius: 12px;
    .btn-wrap {
      margin: 55px 26px 36px;
    }
  }
}
</style>
