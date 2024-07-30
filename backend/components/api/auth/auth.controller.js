const ValidatorUtils = require("../../../utils/validator");
const CommonUtils = require("../../../utils/common");
const {AuthService} = require("./auth.service");
const cookieParser = require("cookie-parser");

class Auth {

    static async loginValidator(req, res, next) {
        req.checkBody('signature', 'signature not valid').notEmpty();
        req.checkBody('data', 'data not valid').notEmpty();
        return await ValidatorUtils.errorMapped(req, res, next);
    }

    static async login(req, res) {
        try {
            console.log(req.body);
            const token = await AuthService.login(req.body);
            if (token === '') {
                return res.json({
                    success: false,
                    code: 100,
                    message: 'login fail'
                })
            }
            res.cookie("token", token, {
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