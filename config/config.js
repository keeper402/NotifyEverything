// noinspection JSUnresolvedReference
const toml = require('toml');
const fs = require("node:fs");
const schedule = require('node-schedule');
require("dotenv")
require('./const')

let config;

let init_fin = false;

function loadConfig() {
    if (process.env.CONFIG_FILE !== undefined) {
        let buffer = fs.readFileSync(process.env.CONFIG_FILE);
        config = toml.parse(buffer.toString('utf-8'));
    } else if (process.env.DEFAULT_CONFIG !== undefined) {
        config = toml.parse(process.env.DEFAULT_CONFIG);
    } else {
        let buffer = fs.readFileSync('./config.toml');
        config = toml.parse(buffer.toString('utf-8'));
    }
    console.log('config: ' + config);
}

function init() {
    if (init_fin) {
        return;
    }
    loadConfig();
    const interval = config.reload_interval || DEFAULT_RELOAD_INTERVAL;
    setInterval(loadConfig, 1000 * 60 * interval);
    init_fin = true;
}

module.exports = {
    init, config
}