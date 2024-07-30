import axios from 'axios';
import {ElMessage} from "element-plus";

enum MSG {
    '操作成功' = 200,
    '密码错误' = 500,
}

export interface ApiResponse<T> {
    success: boolean;
    code: number;
    message: string;
    data?: T; // 可选字段，表示数据部分
}


const $post= axios.create({
    baseURL: '/api',
    method: 'post',
    timeout: 5000,
    headers:{
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json',
    }
});


// $post.interceptors.request.use(config => {
//     const headers = config?.headers || {};
//     headers['x-api-key'] = API_KEY;
//     return config;
// })

 $post.interceptors.response.use(resp => {
     if (resp.data.success !== true) {
         ElMessage.error(resp.data.message)
         return resp;
     }
     return resp;
 }, error => {
     return Promise.reject(error);
 })


export default $post;