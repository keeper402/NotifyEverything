const ValidatorUtils = require("../../../utils/validator");
const CommonUtils = require("../../../utils/common");
const {AuthService, LOGIN_FAIL} = require("./auth.service");
const encrypt = require("../../../utils/encrypt");
const ApiDTO = require("../../types/ApiDTO");

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
            if (token === LOGIN_FAIL) {
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
            return res.json(ApiDTO.success({token: token}));
        } catch (err) {
            return CommonUtils.catchError(res, err);
        }
    }

    static async changePassValidator(req, res, next) {
        req.checkBody('oldPassword', 'oldPassword not valid').notEmpty();
        req.checkBody('newPassword', 'newPassword not valid').notEmpty();
        // req.checkBody('newPassword', 'newPassword can not be default pass').not(encrypt.DEFAULT_PUBLIC_KEY);
        return await ValidatorUtils.errorMapped(req, res, next);
    }

    static async changePass(req, res) {
        const changed = await AuthService.changePassword(req.body.oldPassword, req.body.newPassword);
        if (changed) {
            return res.json(ApiDTO.success(null));
        }
        return res.json(ApiDTO.error(101, 'wrong password'));
    }
}

module.exports = Auth;