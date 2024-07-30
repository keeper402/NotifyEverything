const toml = require('toml');
const Const = require('../config/const');
const fs = require("node:fs");
const DEFAULT_RELOAD_INTERVAL = require("node:fs");
require("dotenv").config()
require('./const')
const request = require('../utils/request')
const rule = require('../components/core/rule')
const util = require('util');
const logger = require("../utils/logger");

config = {};
let initialized = false;

async function reloadConfig() {
    const oldConfig = JSON.parse(JSON.stringify(config));
    if (process.env.DEBUG === 'true') {
        const data = await util.promisify(fs.readFile)('./config.toml', 'utf8');
        config = toml.parse(data);
        Const.TIME_UNIT = parseInt(process.env.TIME_UNIT);
    } else if (process.env.CONFIG_FILE !== undefined) {
        try {
            const data = await request.get(process.env.CONFIG_FILE);
            config = toml.parse(data);
        } catch (e) {
            logger.error(e);
        }
    } else if (process.env.DEFAULT_CONFIG !== undefined) {
        config = toml.parse(process.env.DEFAULT_CONFIG);
    } else {
        let buffer = fs.readFileSync('./config.toml');
        config = toml.parse(buffer.toString('utf-8'));
    }
    const json = JSON.stringify(config);
    config = JSON.parse(json);
    logger.info('init: config: ' + json);
    //reload rule
    rule.reload(oldConfig, config);
}

async function init() {
    if (initialized) {
        return;
    }
    await reloadConfig();
    const interval = config.reloadInterval || Const.DEFAULT_RELOAD_INTERVAL;
    setInterval(reloadConfig, Const.TIME_UNIT * interval);
    initialized = true;
}

module.exports = {
    init
}