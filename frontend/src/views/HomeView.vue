<template>
  <div class="home-view">
    <div class="header-view">
      <el-button plain class="right" @click="dialogFormVisible = true">Change Password</el-button>
    </div>
    <div class="context-view">
      <div class="head-of-edit">
        <h1>Config File</h1>
        <el-button class="right" type="primary" @click="showConfig()" style="display: none">showConfig</el-button>
        <el-button class="right" type="primary" @click="loadConfig(false)" style="display: none">loadConfig</el-button>
        <el-button class="right" type="primary" @click="submitConfig()">Submit</el-button>
      </div>
      <TOMLEditor :config="config" @update:config="updateConfig"/>
    </div>
  </div>


  <el-dialog v-model="dialogFormVisible" title="Change Password" width="500">
    <el-form :model="form">
      <el-form-item label="old password" :label-width="formLabelWidth">
        <el-input v-model="form.oldPassword" type="password" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="repeat password" :label-width="formLabelWidth">
        <el-input v-model="form.oldPasswordRepeat" type="password" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="new password" :label-width="formLabelWidth">
        <el-input v-model="form.newPassword" type="password" autocomplete="off"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="changePassword">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import TOMLEditor from "@/components/TOMLEditor.vue";
import {getCurrentInstance, onMounted, reactive, ref} from 'vue'
import {ElMessage} from "element-plus";
import _ from "lodash";
import {changePass, getConfig, saveConfig} from "@/api/api";
import {generateRSAKeyPairFromMasterKey} from "@/utils/encrypt";
import {tryRefreshToken} from "@/service/login";
import {useRouter} from "vue-router";

const dialogFormVisible = ref(false)
const formLabelWidth = '140px'
const REFRESH_TOKEN_TASK_ID = 'REFRESH_TOKEN_TASK_ID';

const form = reactive({
  oldPassword: '',
  oldPasswordRepeat: '',
  newPassword: '',
})

const config = ref('# Sample TOML\n[WaitLoading]\nminTime = 1\nmaxTime = "infinite"\n# This is a comment');

const updateConfig = (newConfig: string) => {
  config.value = newConfig; // 更新 config
};
const router = useRouter();

onMounted(() => {
  loadConfig(false);
  const globalProperties = getCurrentInstance()?.appContext.config.globalProperties;
  globalProperties?.$registerTask(REFRESH_TOKEN_TASK_ID, tryRefreshToken);
  globalProperties?.$startInterval(); // 调用 $startInterval
});

function submitConfig() {
  saveConfig({config: config.value}).then(res => {
    if (res?.data?.success) {
      ElMessage.info('保存成功✌️ 5s后检验配置...');
    } else {
      ElMessage.info('保存失败😡');
    }
  })

  //5秒后刷新配置
  setTimeout(() => loadConfig(true), 5 * 1000);
}

function loadConfig(showSuccess: boolean) {
  getConfig().then(res => {
    console.log(res);
    if (res?.data?.success) {
      const data = res?.data?.data;
      if (!_.isEmpty(data?.config)) {
        config.value = data?.config;
      } else {
        config.value = '';
      }
      if (data?.configStatus !== 'OK') {
        switch (data?.configStatus) {
          case 'CONFIG_INVALID':
            ElMessage.error('配置文件不合法，请修改👿')
            break;
          case 'CONFIG_ACCESS_ERROR':
            ElMessage.error('无法获取配置文件，请检查🔍')
            break;
        }
      } else if (showSuccess) {
        ElMessage.info('配置文件已加载🙆‍♂️')
      }
    }
  });
}

function showConfig() {
  console.log(config.value)
}

function changePassword() {
  try {
    if (_.isEmpty(form.oldPassword)) {
      ElMessage.error('旧密码不能为空');
      return;
    }
    if (_.isEmpty(form.newPassword)) {
      ElMessage.error('新密码不能为空');
      return;
    }
    if (form.oldPassword !== form.oldPasswordRepeat) {
      ElMessage.error('旧密码不同');
      return;
    }


    const pairOld = generateRSAKeyPairFromMasterKey(form.oldPassword);
    const pubKey = localStorage.getItem('PUBLIC_KEY');
    if (pubKey) {
      if (pairOld.publicKey !== pubKey) {
        ElMessage.error('旧密码不正确');
        return;
      }
    }
    const pairNew = generateRSAKeyPairFromMasterKey(form.newPassword);
    changePass({oldPassword: pairOld.publicKey, newPassword: pairNew.publicKey}).then(response => {
      console.log(response);
      if (response?.data?.success) {
        ElMessage.info('修改成功');
      } else {
        // ElMessage.error('密码错误');
      }
    })
    dialogFormVisible.value = false;
  } catch (e) {
    ElMessage.error('未知异常');
  }
}

</script>

<style scoped>
.home-view {
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
  margin-bottom: 10px;
}

.right {
  display: flex;
  margin-left: auto; /* 强制向右对齐 */
  margin-right: 10px;
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