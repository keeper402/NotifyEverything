import {FormInstance} from "element-plus";
import {ref} from "vue";

interface LoginForm {
    password: string,
}

export class InitLoginData {
    checkData: LoginForm = {
        password: '',
    };
    loginFormRef = ref<FormInstance>();
}