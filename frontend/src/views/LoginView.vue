<template>
  <div class="login-box">
    <h1><img class="logo-box" src="../assets/LOGO_BIG.png" alt=""></h1>
    <el-form
        ref="loginFormRef"
        style="max-width: 600px"
        :model="loginForm"
        status-icon
        :rules="rules"
        label-width="auto"
        class="loginForm"
        @submit.prevent="submit"
    >
      <el-form-item label="密码" prop="password">
        <el-input
            v-model="loginForm.password"
            type="password"
            autocomplete="off"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="sub-bth" @click="submit()">
          登陆
        </el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from 'vue'
import {InitLoginData} from "../types/login";
import {generateRSAKeyPairFromMasterKey} from "@/utils/encrypt";
import {loginByRSAKey} from "@/service/login";

export default defineComponent({
  setup() {
    const data = reactive(
        new InitLoginData()
    );

    const rules = {
      password: [
        {required: true, message: '请输入密码', trigger: 'blur'},
        {min: 6, message: '密码长度大于等于6', trigger: 'blur'},
      ],
    }

    const submit = () => {
      console.log('do submit')
      data.loginFormRef?.validate((isValid) => {
            if (isValid) {
              doLogin(data.loginForm.password);
            }
          }
      );
    }

    function doLogin(password: string): void {
      const pair = generateRSAKeyPairFromMasterKey(password);
      loginByRSAKey(pair.privateKey, pair.publicKey, true);
    }

    return {...toRefs(data), rules, submit}
  }
})
</script>

<style lang="scss" scoped>
.login-box {
  width: 100%;
  height: 100%;
  //background: url("../assets/bg2.png");
  //background-size: cover;
  box-sizing: border-box;
  padding-top: 200px;

  .loginForm {
    width: 350px;
    padding: 20px;
    background: #f6f8fa;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* 添加阴影 */
    margin: 0 auto;

    .sub-bth {
      width: 100%;
    }
  }

  h1 {
    text-align: center;
  }

  .logo-box {
    width: 10%;
    height: auto;
  }
}

</style>