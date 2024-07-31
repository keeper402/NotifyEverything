const encrypt = require("../../../utils/encrypt");
const logger = require("../../../utils/logger");
const KvStore = require("../../../support/kv");
const _ = require("lodash");


const LOGIN_FAIL = '';

class AuthService {

    static async login(body) {
        if (await this.verifyAuth(body.data, body.signature)) {
            const token = encrypt.generateRandomString(64);
            await KvStore.set('token', token, 60 * 60 * 20);
            return token;
        }
        return LOGIN_FAIL;
    }

    static async verifyAuth(data, signature) {
        try {
            logger.info(`data: ${data}, signature: ${signature}`);
            const object = JSON.parse(data);
            if (!this.checkAuthData(object)) {
                return false;
            }
            return encrypt.verifyWithPublicKey(await this.getPassword(), data, signature);
        } catch (e) {
            logger.error('verifyAuth error', e)
        }
        return false;
    }

    static async getPassword() {
        const password = await KvStore.get(encrypt.PASS_KEY);
        return password ? password : encrypt.DEFAULT_PUBLIC_KEY;
    }

    static async changePassword(oldPassword, newPassword) {
        const password = await KvStore.get(encrypt.PASS_KEY);
        const defaultPass = _.isEmpty(password) && oldPassword === encrypt.DEFAULT_PUBLIC_KEY;
        console.log(`password: ${password}, defaultPass: ${defaultPass}, oldPassword: ${oldPassword}`);
        if (defaultPass || password === oldPassword) {
            await KvStore.set(encrypt.PASS_KEY, newPassword);
            return true;
        }
        return false;
    }

    static async passwordChanged() {
        return await this.getPassword() !== encrypt.DEFAULT_PASSWORD;
    }

    static checkAuthData(object) {
        if (object) {
            if (object.time) {
                //一分钟内的请求
                const requestIn = Date.now() - object.time;
                console.log(`requestIn: ${requestIn}, rnd: ${object.rnd}`);
                if (object.rnd && requestIn < 1000 * 60) {
                    return true;
                }
            }
        }
        return false;
    }


}

const authValidator = async (req, res, next) => {
    if (req.url === '/login') {
        next();
        return;
    }
    const token = req.cookies.token;
    if (token === undefined || token === null) {
        return res.status(401).send({
            error: 'Unauthorized',
            message: 'Access token is missing.'
        });
    }
    const tokenInKV = await KvStore.get('token');
    if (!tokenInKV) {
        return res.status(401).send({
            error: 'Unauthorized',
            message: 'Access token is invalid.'
        });
    }
    next();
}

module.exports = {AuthService, authValidator, LOGIN_FAIL};