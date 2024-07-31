const encrypt = require("../../../utils/encrypt");
const logger = require("../../../utils/logger");
const KvStore = require("../../../support/kv");


const CONFIG_KEY = 'config';

class ConfigService {

    static async get() {
        const config = await KvStore.get(CONFIG_KEY);
        const configStatus = await KvStore.get('CONFIG_STATUS');
        return {config:config, configStatus:configStatus};
    }


    static async save(config) {
        await KvStore.set(CONFIG_KEY, config);
    }

}


module.exports = ConfigService;