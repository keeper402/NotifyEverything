import {$get, $post} from "@/api/http";

export interface LoginReq {
    data: string;
    signature: string;
}


export interface ChangePasswordReq {
    oldPassword: string;
    newPassword: string;
}

export interface SaveConfigReq {
    config: string;
}

export const login  = (data: LoginReq) => $post({url:"/login", data:data});

export const changePass  = (data: ChangePasswordReq) => $post({url:"/changePassword", data:data});

export const getConfig  = () => $get({url:"/config/get"});
export const saveConfig  = (data: SaveConfigReq) => $post({url:"/config/save", data:data});