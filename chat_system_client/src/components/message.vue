<script>
export default {
  computed: {
    current_session(){
      return this.$store.state.current_session
    },
    user(){
      return this.$store.state.user
    }
  },
  mounted(){
    this.$socket.onReceiveMessage((result) => {
      const sid = result['from']
      const message = result['message']
      this.$store.commit("RECEIVE_MESSAGE", {"sid": sid, "content": message})
    });
  },
  methods: {
    timeFormat(date) {
			if (typeof date === "string") {
				date = new Date(date);
			}
			return date.getHours() + ":" + date.getMinutes();
		},
    avatarFormat(avatar_path){
      return this.$socket.server_host + avatar_path;
    }
  },
	updated(){
    this.$nextTick(() => {
      var container = this.$refs.el;
      container.scrollTop = container.scrollHeight;
    });
	}
};
</script>

<template>
  <div class="message" ref="el">
    <ul v-if="current_session">
      <li v-for="(message, index) in current_session.messages" :key="index">
        <p class="time">
          <span>{{timeFormat(message.date)}}</span>
        </p>
        <div :class="{'main': true, 'self': message.self}">
          <img
            class="avatar"
            width="30"
            height="30"
            :src="message.self?avatarFormat(user.avatar):avatarFormat(current_session.user.avatar)"          />
          <div class="text">{{message.content}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="less" scoped>
.message {
  padding: 10px 15px;
  overflow-y: scroll;

  li {
    margin-bottom: 15px;
  }
  .time {
    margin: 7px 0;
    text-align: center;

    > span {
      display: inline-block;
      padding: 0 18px;
      font-size: 12px;
      color: #fff;
      border-radius: 2px;
      background-color: #dcdcdc;
    }
  }
  .avatar {
    float: left;
    margin: 0 10px 0 0;
    border-radius: 3px;
  }
  .text {
    display: inline-block;
    position: relative;
    padding: 0 10px;
    max-width: ~"calc(100% - 40px)";
    min-height: 30px;
    line-height: 2.5;
    font-size: 12px;
    text-align: left;
    word-break: break-all;
    background-color: #fafafa;
    border-radius: 4px;

    &:before {
      content: " ";
      position: absolute;
      top: 9px;
      right: 100%;
      border: 6px solid transparent;
      border-right-color: #fafafa;
    }
  }

  .self {
    text-align: right;

    .avatar {
      float: right;
      margin: 0 0 0 10px;
    }
    .text {
      background-color: #b2e281;

      &:before {
        right: inherit;
        left: 100%;
        border-right-color: transparent;
        border-left-color: #b2e281;
      }
    }
  }
}
</style>
