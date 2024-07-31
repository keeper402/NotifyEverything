const toml = require('toml');
const Const = require('../config/const');
const fs = require("node:fs");
require("dotenv").config()
require('./const')
const request = require('../utils/request')
const rule = require('../components/core/rule')
const util = require('util');
const _ = require('lodash');
const logger = require("../utils/logger");
const ConfigService = require("../components/api/config/config.service");


config = {};
let initialized = false;

let needIntervalRefresh = false;

async function reloadConfig() {
    let oldConfig = undefined;
    let configStr = '';
    try {
        needIntervalRefresh = false;
        oldConfig = JSON.parse(JSON.stringify(config));
        if (process.env.DEBUG === 'true') {
            configStr = await util.promisify(fs.readFile)('./config.toml', 'utf8');
            Const.TIME_UNIT = parseInt(process.env.TIME_UNIT);
        } else {
            //按顺序读
            if (process.env.CONFIG_FILE !== undefined) {
                try {
                    configStr = await request.get(process.env.CONFIG_FILE);
                    needIntervalRefresh = true;
                } catch (e) {
                    logger.error(e);
                }
            } else if (process.env.DEFAULT_CONFIG !== undefined) {
                configStr = process.env.DEFAULT_CONFIG;
            } else {
                const configInKv = await ConfigService.get();
                if (!_.isEmpty(configInKv.config)) {
                    configStr = configInKv.config;
                }
            }
        }
        logger.info('in start, config is: ' + configStr);
    } catch (e) {
        logger.error(e);
        return Const.CONFIG_ACCESS_ERROR;
    }
    try {
        //reload rule
        const json = JSON.stringify(toml.parse(configStr));
        config = JSON.parse(json);
        rule.reload(oldConfig, config);
    } catch (e) {
        logger.error(e);
        return Const.CONFIG_INVALID;
    }
    return Const.OK;
}

async function init() {
    if (initialized) {
        return;
    }
    await reloadConfig();
    if (needIntervalRefresh) {
        const interval = config.reloadInterval || Const.DEFAULT_RELOAD_INTERVAL;
        setInterval(reloadConfig, Const.TIME_UNIT * interval);
    }
    initialized = true;
}

module.exports = {
    init, reloadConfig
}