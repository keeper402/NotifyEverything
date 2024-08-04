const encrypt = require("../../../utils/encrypt");
const KvStore = require("../../../support/kv");
const {AuthService} = require("../auth/auth.service");


const CONFIG_KEY = 'config';
const ENCRYPT_KEY = 'ENCRYPT';

class ConfigService {

    static async get() {
        const config = await KvStore.get(CONFIG_KEY);
        const configStatus = await KvStore.get('CONFIG_STATUS');
        return {config: config, configStatus: configStatus};
    }


    static async save(config) {
        //非对称加密，这里只加密，get出来后解密让私钥（在前端）去做
        if (await this.getEncrypt()) {
            await this.saveEncryptConfig(config);
            return;
        }
        await KvStore.set(CONFIG_KEY, config);
    }

    static async getEncrypt() {
        const encrypt = await KvStore.get(ENCRYPT_KEY);
        return encrypt === 'true' || encrypt === true;
    }

    static async saveEncrypt(encrypt, config) {
        console.log(`saveEncrypt ${encrypt} config: ${config}`);
        if (encrypt === 'true' || encrypt === 'false' || typeof encrypt === 'boolean') {
            await KvStore.set(ENCRYPT_KEY, encrypt);
        }
        if (encrypt === 'true' || encrypt === true) {
            await this.saveEncryptConfig(config);
        } else if (encrypt === 'false' || encrypt === false) {
            await KvStore.set(CONFIG_KEY, config);
        }
    }


    static async saveEncryptConfig(config) {
        const pubKey = await AuthService.getPassword();
        const aesKey = encrypt.calculateMD5(pubKey);
        const encryptData = encrypt.encryptByAES(config, aesKey);
        await KvStore.set(CONFIG_KEY, encryptData);
    }

}


module.exports = ConfigService;