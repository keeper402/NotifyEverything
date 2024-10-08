<template>
  <div class="home-view">
    <div class="header-view">
      <el-button plain class="button" style="margin-left: auto" @click="changePassDialogVisible = true">Change Password</el-button>
    </div>
    <div class="context-view">
      <div class="head-of-edit">
        <h1>Config File</h1>
        <el-button class="button" type="primary" @click="showConfig()" style="display: none">showConfig</el-button>
        <div class="head-buttons">
          <el-button class="button" @click="settingDialogVisible = true">Settings</el-button>
          <el-button class="button" type="primary" @click="submitConfig()">Submit</el-button>
        </div>
      </div>
      <TOMLEditor :config="config" @update:config="updateConfig"/>
    </div>
  </div>

  <el-dialog v-model="settingDialogVisible" title="Settings" width="500" class="dialogLoadingClass">
    <el-form :model="form">
      <el-form-item label="Encrypt Config" :label-width="formLabelWidth">
        <el-switch v-model="encryptConfig" @click="switchEncrypt" :disabled="encryptConfigDisable"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="settingDialogVisible = false ;settingLoading = true">Close</el-button>
        <!--        <el-button type="primary" @click="confirmSettings">-->
        <!--          Confirm-->
        <!--        </el-button>-->
      </div>
    </template>
  </el-dialog>


  <el-dialog v-model="changePassDialogVisible" title="Settings" width="500">
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
        <el-button @click="changePassDialogVisible = false">Cancel</el-button>
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
import {ElMessage, ElLoading} from "element-plus";
import _ from "lodash";
import {changePass, getConfig, getEncryptSwitch, saveConfig, saveEncryptSwitch} from "@/api/api";
import {calculateMD5, decryptByAES, generateRSAKeyPairFromMasterKey} from "@/utils/encrypt";
import {tryRefreshToken} from "@/service/login";
import router from "@/router";

const changePassDialogVisible = ref(false)
const settingDialogVisible = ref(false)
const encryptConfig = ref(false)
const encryptConfigDisable = ref(true)
const settingLoading = ref(false)
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

onMounted(() => {
  const encryptSwitchPromise = loadEncryptSwitch();
  loadConfig(false, encryptSwitchPromise);
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
  setTimeout(() => loadConfig(true, null), 5 * 1000);
}

function loadConfig(showSuccess: boolean, encryptSwitchPromise: Promise<any> | null) {
  getConfig().then(async res => {
    let encrypted = encryptConfig.value;
    if (encryptSwitchPromise !== null) {
      const encryptCallData = await encryptSwitchPromise;
      if (encryptCallData?.data?.success && encryptCallData?.data?.data?.encrypt !== undefined) {
        encrypted = encryptCallData?.data?.data?.encrypt;
      }
    }
    if (res?.data?.success) {
      const data = res?.data?.data;
      if (!encrypted) {
        if (!_.isEmpty(data?.config)) {
          config.value = data?.config;
        } else {
          config.value = '';
        }
      } else {
        const pubKey = localStorage.getItem('PUBLIC_KEY');
        if (pubKey) {
          try {
            const aesKey = calculateMD5(pubKey);
            const value = decryptByAES(data?.config, aesKey);
            config.value = value ? value : '';
          } catch (e) {
            console.error(e);
            ElMessage.error('解密数据失败😭');
          }
        } else {
          ElMessage.error('请重新登陆');
        }
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
    if (_.isEmpty(form.newPassword) || _.size(form.newPassword) <6) {
      ElMessage.error('新密码必须在6位以上');
      return;
    }
    if (form.oldPassword !== form.oldPasswordRepeat) {
      ElMessage.error('旧密码不同');
      return;
    }

    const loadingInstance = ElLoading.service({
      lock: true,
      text: 'Loading...',
      spinner: 'el-icon-loading',
      background: 'rgba(255, 255, 255, 0.7)'
    });
    const pairOld = generateRSAKeyPairFromMasterKey(form.oldPassword);
    const pubKey = localStorage.getItem('PUBLIC_KEY');
    if (pubKey) {
      if (pairOld.publicKey !== pubKey) {
        ElMessage.error('旧密码不正确');
        return;
      }
    }
    const pairNew = generateRSAKeyPairFromMasterKey(form.newPassword);
    changePass({oldPassword: pairOld.publicKey, newPassword: pairNew.publicKey, config:config.value}).then(response => {
      console.log(response);
      loadingInstance.close();
      if (response?.data?.success) {
        ElMessage.info('修改成功,请重新登陆');
        document.cookie = 'token=; Max-Age=0; path=/';
        router.push('/login');
      } else {
        // ElMessage.error('密码错误');
      }
    })
    changePassDialogVisible.value = false;
  } catch (e) {
    ElMessage.error('未知异常');
  }
}

function loadEncryptSwitch() {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: 'Loading...',
    spinner: 'el-icon-loading',
    background: 'rgba(255, 255, 255, 0.7)'
  });
  const encryptSwitchPromise = getEncryptSwitch();
  encryptSwitchPromise.then(res => {
    if (res?.data?.success) {
      encryptConfig.value = res.data.data.encrypt;
      encryptConfigDisable.value = false;
    } else {
      // ElMessage.error('密码错误');
    }
    loadingInstance.close();
  });
  return encryptSwitchPromise;
}

function switchEncrypt() {
  const loadingInstance = ElLoading.service({
    lock: true,
    target: '.dialogLoadingClass',
    text: 'Loading...',
    spinner: 'el-icon-loading',
    background: 'rgba(255, 255, 255, 0.7)'
  });
  const data = {encrypt: encryptConfig.value, config: config.value};
  saveEncryptSwitch(data).then(res => {
    loadingInstance.close();
    if (res?.data?.success) {
      ElMessage.info('修改成功');
    } else {
      // ElMessage.error('密码错误');
    }
  });
}

</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  align-items: center; /* 水平居中子元素 */
}

.context-view {
  display: flex;
  flex-direction: column; /* 垂直布局 */
  box-sizing: border-box; /* 确保padding不影响宽高 */
  width: auto; /* 使宽度随父元素变化 */
  padding-top: 50px;
}

@media (max-width: 1400px) {
  .context-view {
    width: calc(100% - 40px); /* 当宽度小于1000px时，盒子跟随缩小 */
  }
}

.header-view {
  display: flex;
  flex-direction: row;
  align-items: center; /* 垂直居中 */;
  background-color: dimgray;
  width: 100%;
  height: 50px;
}

.head-of-edit {
  display: flex;
  flex-direction: row;
  align-items: center; /* 垂直居中 */;
  margin-bottom: 10px;
}

.button {
  display: flex;
}

.dialogLoadingClass {
  display: flex;
}

.head-buttons {
  display: flex;
  flex-direction: row;
  margin-left: auto; /* 强制向右对齐 */
}
</style>