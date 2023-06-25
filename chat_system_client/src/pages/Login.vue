<template>
  <div class="login-container">
    <el-form ref="form" :model="form" class="login-main">
      <h1 style="text-align: center">在线聊天系统</h1>
      <el-form-item prop="username" :rules="rules.username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item style="text-align: right">
        <el-button type="primary" @click="onSubmit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      const pattern = /^[\u4E00-\u9FA5]{1,6}$/;
      if (!pattern.test(value)) {
        callback("用户名只能输入汉字，且不能大于六个汉字");
      } else {
        callback();
      }
    };
    return {
      form: {
        username: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { validator: validateUsername, trigger: "blur" },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 判断socket是否登录
          if (!this.$socket.connected) {
            this.$socket.connect();
          }
          this.$socket.emitLogin(this.form.username, (result) => {
            if (result["code"] === 200) {
              const data = result["data"];
              const user = data["user"];
              const online_users = data["online_users"];
              this.$store.commit("SET_SESSIONS", online_users);
              // this.$chat.setUser(user);
              this.$store.commit("SET_USER", user);
              this.$router.push({ name: "home" });
            } else {
              ElMessage.error(result["message"]);
            }
          });
        } else {
          ElMessage.error("请检查输入信息");
        }
      });
    },
  },
};
</script>

<style scoped>
html,
body {
  height: 100%;
}
.login-container {
  width: 100vw;
  height: 100vh;
  background-image: url("../assets/login_bg.png");
  background-size: cover;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container .login-main {
  /* border-radius: 5px; */
  /* background-clip: padding-box; */
  /* margin: 280px auto; */
  width: 350px;
  padding: 35px 35px 15px;
  background: #fff;
  border: 1px solid #eaeaea;
  -webkit-box-shadow: 0 0 25px #cac6c6;
  box-shadow: 0 0 25px #cac6c6;
}
</style>