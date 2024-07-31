const encrypt = require("../../../utils/encrypt");
const logger = require("../../../utils/logger");
const KvStore = require("../../../support/kv");

class ConfigService {

    static async login(body) {
        if (await this.verifyAuth(body)) {
            const token = encrypt.generateRandomString(64);
            await KvStore.set('token', token);
            return token;
        }
        return '';
    }

    static async verifyAuth(body) {
        try {
            console.log(body);
            const object = JSON.parse(body.data);
            if (!this.checkAuthData(object)) {
                return false;
            }
            return encrypt.verifyWithPublicKey(await this.getPassword(), body.data, body.signature);
        } catch (e) {
            logger.error('verifyAuth error', e)
        }
        return false;
    }

    static async getPassword() {
        return encrypt.DEFAULT_PUBLIC_KEY;
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
