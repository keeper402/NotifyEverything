import $post from "@/api/http";

export interface LoginReq {
    account: string;
    password: string;
}

export const checkPass = (data: LoginReq) => $post({url:"/checkPass", data:data});