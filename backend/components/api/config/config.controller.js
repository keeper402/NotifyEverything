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
}

module.exports = Config;