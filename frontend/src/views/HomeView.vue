<template>
  <div class="home-view">
    <div class="header-view">
      <el-button class="right">Change Password</el-button>
    </div>
    <div class="context-view">
      <div class="head-of-edit">
        <h1>Config File</h1>
        <el-button class="right" type="primary">Submit</el-button>
      </div>
      <TOMLEditor/>
    </div>
  </div>
</template>

<script setup lang="ts">
import TOMLEditor from "@/components/TOMLEditor.vue";
</script>

<style scoped>
.home-view{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: stretch; /* 关键：子元素默认占满高度 */
}

.context-view {
  display: flex;
  flex-direction: column; /* 垂直布局 */
  justify-content: center; /* 水平居中 */
  align-items: flex-start; /* 关键：子元素默认占满高度 */
  box-sizing: border-box; /* 确保padding不影响宽高 */
  padding-top: 50px;
  height: auto; /* 使容器填满整个视口 */
  min-height: calc(100%);
  width: 100%; /* 确保容器宽度为100% */
  max-width: 1000px;
  flex-grow: 1; /* 关键：占据剩余空间 */
}

.head-of-edit {
  display: flex;
  flex-direction: row; /* 垂直布局 */
  width: 100%; /* 确保头部占满宽度 */
  align-items: center; /* 垂直居中 */;
}

.right {
  display: flex;
  margin-left: auto;
}

/* 响应式样式 */
@media (max-width: 1200px) {
  .context-view {
    width: calc(100% - 40px); /* 当宽度小于1000px时，盒子跟随缩小 */
  }
}

.header-view {
  display: flex;
  flex-direction: row; /* 垂直布局 */
  align-items: center; /* 垂直居中 */;
  background-color: dimgray;
  width: 100%;
  height: 50px;
}
</style>