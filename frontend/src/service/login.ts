import {generateRandomString, signWithPrivateKey} from "@/utils/encrypt";
import {login} from "@/api/api";
import {ElMessage} from "element-plus";
import router from "@/router";


export function loginByRSAKey(privateKey: string, publicKey: string, redirect: boolean): void {
    try {
        const info = {
            time: Date.now(),
            rnd: generateRandomString(16)
        };
        const stringify = JSON.stringify(info);
        const signature = signWithPrivateKey(privateKey, stringify);
        login({signature: signature, data: stringify}).then((response) => {
            console.log(response);
            if (response?.data?.success) {
                localStorage.setItem('PUBLIC_KEY', publicKey);
                localStorage.setItem('PRIVATE_KEY', privateKey);
                localStorage.setItem('token', JSON.stringify(response.data.token));
                localStorage.setItem('token_expire', (Date.now() + 1000 * 60 * 60 * 2).toString())
                localStorage.setItem('key_pair_expire', (Date.now() + 1000 * 60 * 60 * 24 * 7).toString());
                if (redirect) {
                    router.push('/');
                }
            }
        });
    } catch (error) {
        console.log(error);
        ElMessage.error('未知异常')
    }
}


export function tryRefreshToken() {
    if (checkTokenNeedRefresh()) {
        const privateKey = getRSAKeyWithExpire('PRIVATE_KEY');
        if (privateKey === '') {
            localStorage.removeItem('PRIVATE_KEY')
            localStorage.removeItem('PUBLIC_KEY')
            ElMessage.error('登陆失效');
            router.push('/login');
        }
        const publicKey = getRSAKeyWithExpire('PUBLIC_KEY');
        loginByRSAKey(privateKey, publicKey, false);
    }
}


function getRSAKeyWithExpire(key: string): string {
    const expire = localStorage.getItem('token_expire');
    if (expire) {
        const expireTime = parseInt(expire);
        const currentTime = Date.now();

        // 检查剩余时间
        if (expireTime - currentTime > 0) {
            const result = localStorage.getItem(key);
            return result ? result : '';
        }
    }
    return '';
}

function checkTokenNeedRefresh(): boolean {
    const expire = localStorage.getItem('token_expire');
    if (expire) {
        const expireTime = parseInt(expire);
        const currentTime = Date.now();

        // 检查剩余时间
        if (expireTime - currentTime < 30 * 60 * 1000) { // 剩余时间小于 30 分钟
            return true;
        }
    }
    return false;
}