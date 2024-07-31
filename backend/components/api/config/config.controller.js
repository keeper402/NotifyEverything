const {success} = require("../../types/ApiDTO");
const ConfigService = require("./config.service");
const ApiDTO = require("../../types/ApiDTO");
const {reloadConfig} = require("../../../config/configuration");


class Config {
    static async save(req, res) {
        await ConfigService.save(req.body.config);
        reloadConfig().then(ignore => undefined);
        return res.json(success({}));
    }

    static async get(req, res) {
        const config = await ConfigService.get();
        return res.json(ApiDTO.success({config: config}));
    }
}

module.exports = Config;