const toml = require('toml');
const Const = require('../config/const');
const fs = require("node:fs");
const DEFAULT_RELOAD_INTERVAL = require("node:fs");
require("dotenv").config()
require('./const')
const request = require('../utils/request')
const rule = require('../components/rule')


let initialized = false;

async function reloadConfig() {
    if (process.env.DEBUG === 'true') {
        const data = fs.readFileSync('./config.toml', 'utf8');
        global.config = toml.parse(data);
    } else if (process.env.CONFIG_FILE !== undefined) {
        try {
            const data = await request.get(process.env.CONFIG_FILE);
            global.config = toml.parse(data);
        } catch (e) {
            console.error(e);
        }
    } else if (process.env.DEFAULT_CONFIG !== undefined) {
        global.config = toml.parse(process.env.DEFAULT_CONFIG);
    } else {
        let buffer = fs.readFileSync('./config.toml');
        global.config = toml.parse(buffer.toString('utf-8'));
    }
    const json = JSON.stringify(global.config);
    global.config = JSON.parse(json);
    console.log('config: ' + json);
    //reload rule
    rule.reload();
}

async function init() {
    if (initialized) {
        return;
    }
    await reloadConfig();
    const interval = global.config.reload_interval || Const.DEFAULT_RELOAD_INTERVAL;
    setInterval(reloadConfig, Const.TIME_UNIT * interval);
    initialized = true;
}

module.exports = {
    init
}