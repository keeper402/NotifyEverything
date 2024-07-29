<template>
  <div class="home-view">
    <div class="context-view">
      <div class="head-of-view">
        <h1>Config File</h1>
        <el-button class="right">Submit</el-button>
      </div>
      <TOMLEditor/>
    </div>
  </div>
</template>

<script setup lang="ts">
import TOMLEditor from "@/components/TOMLEditor.vue";
</script>

<style scoped>
.code-box {
  padding-top: 50px;
  width: 50%;
}
.home-view{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center; /* 水平居中 */
}

.context-view {
  display: flex;
  flex-direction: column; /* 垂直布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直顶部对齐 */
  box-sizing: border-box; /* 确保padding不影响宽高 */
  height: auto; /* 使容器填满整个视口 */
  min-height: 100%;
  width: 100%; /* 确保容器宽度为100% */
  max-width: 1000px;
}

.head-of-view {
  display: flex;
  width: 100%; /* 确保头部占满宽度 */
  align-items: center; /* 垂直居中 */;

  .right {
    margin-left: auto;
  }
}


/* 响应式样式 */
@media (max-width: 1000px) {
  .head-of-view {
    width: calc(100% - 40px); /* 当宽度小于1000px时，盒子跟随缩小 */
  }
}

</style>