import {$get, $post} from "@/api/http";

export interface LoginReq {
    data: string;
    signature: string;
}


export interface ChangePasswordReq {
    config: any;
    oldPassword: string;
    newPassword: string;
}

export interface SaveConfigReq {
    config: any;
}
export interface SaveEncryptConfigReq {
    encrypt: boolean;
    config: string;
}

export const login  = (data: LoginReq) => $post({url:"/login", data:data});

export const changePass  = (data: ChangePasswordReq) => $post({url:"/changePassword", data:data});

export const getConfig  = () => $get({url:"/config/get"});
export const saveConfig  = (data: SaveConfigReq) => $post({url:"/config/save", data:data});

export const getEncryptSwitch  = () => $get({url:"/config/getEncrypt"});
export const saveEncryptSwitch  = (data: SaveEncryptConfigReq) => $post({url:"/config/saveEncrypt", data:data});