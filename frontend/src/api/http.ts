import axios from 'axios';
import {ElMessage} from "element-plus";
import router from "@/router";

// enum MSG {
//     '操作成功' = 200,
//     '密码错误' = 500,
// }

export interface ApiResponse<T> {
    success: boolean;
    code: number;
    message: string;
    data?: T; // 可选字段，表示数据部分
}


export const $post = axios.create({
    baseURL: '/api',
    method: 'post',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json',
    }
});

export const $get = axios.create({
    baseURL: '/api',
    method: 'get',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json',
    }
});


// $post.interceptors.request.use(config => {
//     const headers = config?.headers || {};
//     headers['x-api-key'] = API_KEY;
//     return config;
// })

const onFulfilled = (resp: any) => {
    if (resp.data.success !== true) {
        ElMessage.error(resp.data.message)
        return resp;
    }
    return resp;
};
const onRejected = (error: any) => {
    console.log(error);
    // 检查 error.response 是否存在
    const status = error.response ? error.response.status : null;
    if (status === 401) {
        ElMessage.error('登陆失效');
        router.push('/login');
    }
};
$post.interceptors.response.use(onFulfilled, onRejected)
$get.interceptors.response.use(onFulfilled, onRejected)

