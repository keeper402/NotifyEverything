// noinspection JSUnresolvedReference
const toml = require('toml');
const fs = require("node:fs");
const http = require("node:http");
require("dotenv").config()
require('./const')
const https = require("node:https");

let config;

let init_fin = false;

const getConfig = async () => {
    return new Promise((resolve, reject) => {
        https.get(process.env.CONFIG_FILE, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(toml.parse(data));
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
};

async function loadConfig() {
    if (process.env.CONFIG_FILE !== undefined) {
        try {
            config = await getConfig();
        } catch (e) {
            console.error(e);
        }
    } else if (process.env.DEFAULT_CONFIG !== undefined) {
        config = toml.parse(process.env.DEFAULT_CONFIG);
    } else {
        let buffer = fs.readFileSync('./config.toml');
        config = toml.parse(buffer.toString('utf-8'));
    }
    console.log('config: ' + JSON.stringify(config));
}

async function init() {
    if (init_fin) {
        return;
    }
    await loadConfig();
    const interval = config.reload_interval || DEFAULT_RELOAD_INTERVAL;
    setInterval(loadConfig, 1000 * 60 * interval);
    init_fin = true;
}

module.exports = {
    init, config
}