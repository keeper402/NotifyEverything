const {success} = require("../../types/ApiDTO");
const ConfigService = require("./config.service");
const ApiDTO = require("../../types/ApiDTO");
const {reloadConfig} = require("../../../config/configuration");
const KvStore = require("../../../support/kv");


class Config {
    static async save(req, res) {
        await ConfigService.save(req.body.config);
        reloadConfig().then(res => {
            KvStore.set('CONFIG_STATUS', res);
        })
        return res.json(success({}));
    }

    static async get(req, res) {
        const config = await ConfigService.get();
        return res.json(ApiDTO.success(config));
    }

    static async saveEncrypt(req, res) {
        await ConfigService.saveEncrypt(req.body.encrypt, req.body.config);
        return res.json(success({}));
    }

    static async getEncrypt(req, res) {
        const encrypt = await ConfigService.getEncrypt();
        return res.json(ApiDTO.success({encrypt: encrypt}));
    }
}

module.exports = Config;