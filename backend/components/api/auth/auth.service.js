import encrypt, {generateRandomString} from "../../../utils/encrypt";
import logger from "../../../utils/logger";
import KvStore from "../../../support/kv";

class AuthService {

    static async login(body) {
        if (await this.verifyAuth(body)) {
            const token = generateRandomString(64);
            await KvStore.set('token', token);
            return token;
        }
        return '';
    }

    static async verifyAuth(body) {
        try {
            const object = JSON.parse(body.data);
            if (!this.checkAuthData(object)) {
                return false;
            }
            return encrypt.verifyWithPublicKey(this.getPassword(), body.data, body.signature);
        } catch (e) {
            logger.error('checkPass error', e)
        }
        return false;
    }

    static async getPassword() {
        return encrypt.DEFAULT_PUBLIC_KEY;
    }

    static async passwordChanged() {
        return await this.getPassword() !== encrypt.DEFAULT_PASSWORD;
    }

    private static checkAuthData(object) {
        if (object) {
            if (object.time) {
                //一分钟内的请求
                if (Date.now() - object.time < 1000 * 60) {
                    return true;
                }
            }
        }
        return false;
    }


}

const authValidator = async (req, res, next) => {
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

module.exports = {AuthService, authValidator};