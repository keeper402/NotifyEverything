<template>
  <div class="login-box">
      <h1><img class="logo-box" src="../assets/LOGO_BIG.png" alt=""></h1>
      <el-form
          ref="loginFormRef"
          style="max-width: 600px"
          :model="checkData"
          status-icon
          :rules="rules"
          label-width="auto"
          class="loginForm"
      >
        <el-form-item label="密码" prop="password">
          <el-input
              v-model="checkData.password"
              type="password"
              autocomplete="off"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="sub-bth" @click="submitForm()">
            登陆
          </el-button>
        </el-form-item>
      </el-form>

  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from 'vue'
import {useRouter} from 'vue-router';
import {InitLoginData} from "../types/login";

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
    let router = useRouter();
    const submitForm = () => {
      data.loginFormRef?.validate((isValid) => {
            if (isValid) {
              // login(data.loginForm).then((response) => {
              //   console.log(response);
              //   localStorage.setItem('loginRes', response.data)
              //   router.push('/');
              // });
              alert('验证通过')
            }
          }
      );
    }


    return {...toRefs(data), rules, submitForm}
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