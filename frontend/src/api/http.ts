import axios from "axios";
import {ElMessage} from "element-plus";

enum MSG {
    '操作成功' = 200,
    '密码错误' = 500,
}

const API_KEY = 'ea26aabca1894b18a91e10721c3a1d1f';

const $post = axios.create({
    baseURL: 'http://localhost:3000/api',
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
         ElMessage.error(resp.data.msg)
         return Promise.reject(resp.data);
     }
     return resp.data;
 }, error => {
     return Promise.reject(error);
 })


export default $post;