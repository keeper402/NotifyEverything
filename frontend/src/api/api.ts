import $post from "@/api/http";

export interface LoginReq {
    data: string;
    signature: string;
}

export const login = (data: LoginReq) => $post({url:"/login", data:data});