<template>
  <h1 style="text-align: center; padding: 10px">在线聊天系统</h1>
  <div class="home-container">
    <template v-if="$store.state.user">
      <div class="sidebar">
        <card></card>
        <list></list>
      </div>
      <div class="main">
        <message></message>
        <chat-text></chat-text>
      </div>
    </template>
  </div>
</template>

<script>
import card from "../components/card.vue";
import list from "../components/list.vue";
import ChatText from "../components/text.vue";
import message from "../components/message.vue";

export default {
  name: "Home",
  created() {},
  mounted() {
    if (!this.$store.getters.logined) {
      this.$router.push({ name: "login" });
      return;
    }
  },
  components: {
    card,
    list,
    [ChatText.name]: ChatText,
    message,
  },
};
</script>


<style>
body,
html {
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
body {
  font: 14px/1.4em "Helvetica Neue", Helvetica, "Microsoft Yahei", Arial,
    sans-serif;
  background: #f5f5f5 url("../assets/chat_bg.jpg") no-repeat center;
  background-size: cover;
}
ul {
  list-style: none;
}
</style>

<style scoped lang="less">
.home-container {
  margin: 20px auto;
  width: 60vw;
  height: 80vh;

  overflow: hidden;
  border-radius: 3px auto;

  display: flex;
  flex-direction: row;

  .sidebar {
    flex-shrink: 0;
    width: 200px;
    color: #f4f4f4;
    background-color: #2e3238;
  }
  .main {
    flex-grow: 1;
    position: relative;
    overflow: hidden;
    background-color: #eee;
  }
  .text {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
  }
  .message {
    height: calc(100% - 160px);
  }
}
</style>