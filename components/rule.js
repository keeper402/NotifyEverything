const notify = require("./notify");
const Const = require('../config/const');
const jsonpath = require('jsonpath');
const {rest, getResourceConfig, getResourceCall} = require("./resource");
const {replaceVariables} = require("../utils/strings");

let rules = new Map();
let defaultInterval = 30;

let initialized = false;

function addRule(ruleName, ruleConfig) {
    //找到资源名
    if (ruleConfig.condition === undefined) {
        return;
    }
    const regex = /\${(.*?)}/g;
    let match;
    let resourceNames = [];
    while ((match = regex.exec(ruleConfig.condition)) !== null) {
        resourceNames.push(match[1]);
    }
    //map 资源名 => 资源function
    let getResourceMap = new Map();
    for (let resourceName of resourceNames) {
        const resourceConfig = getResourceConfig(resourceName);
        let resourceCall = getResourceCall(resourceConfig);
        if (resourceCall !== undefined) {
            getResourceMap.set(resourceName, resourceCall);
        }
    }
    const checkConditionAndNotify = async function () {
        let map = new Map();
        for (let key of getResourceMap.keys()) {
            const resource = await getResourceMap.get(key)();
            map.set(key, resource);
        }
        let condition = replaceVariables(ruleConfig.condition, map);
        let msg = replaceVariables(ruleConfig.msg, map);
        if (eval(condition) === true) {
            const notifyConfig = notify.getNotifyConfig(ruleConfig.notify)
            await notify.notify(notifyConfig, msg);
        }
    };
    const interval = ruleConfig.interval || defaultInterval;
    const intervalRule = setInterval(checkConditionAndNotify, Const.TIME_UNIT * interval);
    rules.set(ruleName, intervalRule);
}

function init() {
    if (initialized) {
        return;
    }
    loadConfig();
    initialized = true;
}

function reload(config){
    clearAllRule();
    loadConfig(config);
}

function loadConfig(){
    for (const key of Object.keys(config.rule)) {
        addRule(key, config.rule[key]);
    }
}

function clearAllRule() {
    rules.forEach((name, intervalRule) => {
        clearInterval(intervalRule);
    })
}

module.exports = {
    reload
}
