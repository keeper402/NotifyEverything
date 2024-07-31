const {success} = require("../../types/ApiDTO");
const ConfigService = require("./config.service");
const ApiDTO = require("../../types/ApiDTO");


class Config {
    static async save(req, res) {
        await ConfigService.save(req.body.config);
        return res.json(success({}));
    }

    static async get(req, res) {
        const config = await ConfigService.get();
        return res.json(ApiDTO.success({config: config}));
    }
}

module.exports = Config;