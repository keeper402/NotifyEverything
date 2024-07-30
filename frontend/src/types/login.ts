import {FormInstance} from "element-plus";
import {ref} from "vue";

interface LoginForm {
    password: string,
}

export class InitLoginData {
    loginForm: LoginForm = {
        password: '',
    };
    loginFormRef = ref<FormInstance>();
}