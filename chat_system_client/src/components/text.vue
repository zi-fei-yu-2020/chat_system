<template>
  <el-popover
    placement="top"
    width="200"
    trigger="click"
    v-model="popoverVisible"
  >
    <el-form
      label-position="left"
      label-width="0"
      inline
      class="chat-action-popover-form"
    >
      <el-form-item>
        <el-upload
          ref="imageUploader"
          :auto-upload="false"
          class="chat-action-popover-upload"
          :file-list="imageFileList"
          :on-change="handleImageChange"
          :show-file-list="false"
          accept="image/*"
        >
          <el-tooltip content="发送图片" placement="bottom" effect="dark">
            <i class="el-icon-picture"></i>
          </el-tooltip>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-tooltip content="选择表情" placement="bottom" effect="dark">
          <i class="el-icon-smile"></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item>
        <el-upload
          ref="fileUploader"
          :show-file-list="false"
          :on-change="handleFileChange"
          :auto-upload="false"
          class="chat-action-popover-upload"
          :file-list="fileList"
        >
          <el-tooltip content="发送文件" placement="bottom" effect="dark">
            <i class="el-icon-paperclip"></i>
          </el-tooltip>
        </el-upload>
      </el-form-item>
    </el-form>
    <i slot="reference" class="el-icon-plus"></i>
  </el-popover>
  <div class="text">
    <textarea
      placeholder="请输入消息"
      v-model="content"
      @keydown="sendOnEnter"
    ></textarea>
    <div class="chat-action-container">
      <el-tooltip content="发送图片" placement="bottom" effect="dark">
        <i
          class="el-icon-picture chat-action-btn"
          @click="popoverVisible = true"
        ></i>
      </el-tooltip>
      <el-tooltip content="选择表情" placement="bottom" effect="dark">
        <i class="el-icon-smile chat-action-btn"></i>
      </el-tooltip>
      <el-upload
        ref="fileUpload"
        :show-file-list="false"
        :on-change="handleFileChange"
        :auto-upload="false"
        class="chat-action-btn"
        :file-list="fileList"
      >
        <el-tooltip content="发送文件" placement="bottom" effect="dark">
          <i class="el-icon-paperclip"></i>
        </el-tooltip>
      </el-upload>
    </div>
    <el-button type="primary" size="large" @click="sendMessage">发送</el-button>
  </div>
</template>

<script>
import { ElMessage, ElUpload, ElTooltip, ElPopover } from "element-plus";

export default {
  name: "chat-text",
  components: {
    ElUpload,
    ElTooltip,
    ElPopover,
  },
  computed: {
    current_session() {
      return this.$store.state.current_session;
    },
  },
  data() {
    return {
      content: "",
      fileList: [],
      popoverVisible: false,
      imageFileList: [],
    };
  },
  methods: {
    sendMessage() {
      if (!this.current_session) {
        ElMessage.info("请先选中聊天对象！");
        return;
      }
      const content = this.content;
      this.$socket.emitSendMessage(
        { to: this.current_session.user.sid, message: this.content },
        (result) => {
          if (result["code"] == 200) {
            this.$store.commit("SEND_MESSAGE", content);
          }
        }
      );
      this.content = "";
    },
    sendOnEnter(event) {
      if (event.keyCode == 13 && !event.shiftKey && !event.ctrlKey) {
        event.preventDefault();
        this.sendMessage();
      } else if (event.keyCode == 13 && event.ctrlKey) {
        this.content += "\n";
      }
    },
    handleImageChange(file, fileList) {
      if (file.raw.size > 1024 * 1024 * 2) {
        ElMessage.error("上传的图片大小不能超过2MB！");
        return false;
      }
      this.imageFileList = fileList;
      const reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = () => {
        const image = new Image();
        image.src = reader.result;
        image.onload = () => {
          const width = image.width;
          const height = image.height;
          this.$socket.emitSendMessage({
            to: this.current_session.user.sid,
            message: reader.result,
            type: "image",
            width,
            height,
          });
        };
      };
    },
    handleFileChange(file, fileList) {
      this.fileList = fileList;
      if (file.raw.size > 1024 * 1024 * 10) {
        ElMessage.error("上传的文件大小不能超过10MB！");
        return false;
      }
      this.$socket.emitSendMessage({
        to: this.current_session.user.sid,
        message: file.raw,
        type: "file",
        fileName: file.name,
        fileSize: file.size,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.text {
  height: 160px;
  border-top: solid 1px #ddd;
  position: relative;
  textarea {
    padding: 10px;
    height: 100%;
    width: 100%;
    border: none;
    outline: none;
    font-family: "Micrsofot Yahei";
    resize: none;
    position: relative;
    z-index: 1;
  }

  button {
    position: absolute;
    top: 105px;
    left: 82%;
    z-index: 2;
  }

  .chat-action-container {
    position: absolute;
    top: 0;
    right: 5px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    .chat-action-btn {
      font-size: 20px;
      cursor: pointer;
    }
    .chat-action-popover-form {
      .chat-action-popover-upload {
        display: inline-block;
        margin: 0 6px;
        .el-upload-dragger {
          border: none;
        }
        .el-upload-list {
          display: none !important;
        }
      }
    }
  }
}
</style>