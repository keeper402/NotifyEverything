import ValidatorUtils from "../../../utils/validator";
import CommonUtils from "../../../utils/common";
import {AuthService} from "./auth.service";
import cookieParser from "cookie-parser";

class Auth {

    static async loginValidator(req, res, next) {
        req.checkBody('password', 'Password not valid').notEmpty().len({min: 6});
        return await ValidatorUtils.errorMapped(req, res, next);
    }

    static async login(req, res) {
        try {
            const token = await AuthService.login(req.body);
            if (token === '') {
                return res.json({
                    success: false,
                    code: 100,
                    message: 'login fail'
                })
            }
            cookieParser.set("token", token, {
                maxAge: 1000 * 60 * 60 * 2, // 过期时间，单位为毫秒
                httpOnly: true, // 仅限 HTTP 请求，JavaScript 无法访问
                secure: true,   // 仅在 HTTPS 下发送
                sameSite: 'Strict' // 防止 CSRF 攻击
            });
            return res.json({
                success: true,
                code: 0,
                message: 'OK',
                data: {
                    token: token
                }
            });
        } catch (err) {
            return CommonUtils.catchError(res, err);
        }
    }
}


module.exports = Auth;