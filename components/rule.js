const notify = require("./notify");
const Const = require("../config/const");
const schedule = require("node-schedule");
const {getResourceConfig, getResourceCall} = require("./resource");
const {replaceVariables} = require("../utils/strings");

let rules = new Map();
let defaultInterval = 30;

let initialized = false;

const lastNotify = new Map();

function addRule(ruleName, ruleConfig) {
    //check valid
    if (ruleConfig.condition === undefined) {
        return;
    }
    const regex = /\${(.*?)}/g;
    let match;
    let resourceNames = [];
    while ((match = regex.exec(ruleConfig.condition)) !== null) {
        resourceNames.push(match[1]);
    }
    //map resourceName => getResource function
    let getResourceMap = new Map();
    for (let resourceName of resourceNames) {
        const resourceConfig = getResourceConfig(resourceName);
        let resourceCall = getResourceCall(resourceConfig);
        if (resourceCall !== undefined) {
            getResourceMap.set(resourceName, resourceCall);
        }
    }
    // Closure for checkAndNotify
    const checkConditionAndNotify = async function () {
        let resourceValues = new Map();
        for (let key of getResourceMap.keys()) {
            const resource = await getResourceMap.get(key)();
            resourceValues.set(key, resource);
        }
        // replace resource var
        let condition = replaceVariables(ruleConfig.condition, resourceValues);
        let msg = replaceVariables(ruleConfig.msg, resourceValues);
        // check condition
        if (eval(condition) === true) {
            const notifyConfig = notify.getNotifyConfig(ruleConfig.notify)
            const lastTime = lastNotify.get(ruleName);
            // check muteAfterNotify
            if (lastTime !== undefined && lastTime - Date.now() < ruleConfig.muteAfterNotify * Const.TIME_UNIT) {
                console.log(`now: ${new Date()}, rule: ${ruleName} in mute period. Notify will be sent after ${new Date(lastTime + ruleConfig.muteAfterNotify * Const.TIME_UNIT)}`);
                return;
            }
            // do notify
            await notify.notify(notifyConfig, msg);
            lastNotify.put(ruleName, Date.now());
        }
    };
    if (ruleConfig.corn !== undefined) {
        const scheduleJob = schedule.scheduleJob(ruleConfig.corn, checkConditionAndNotify);
        rules.set(ruleConfig, scheduleJob);
    } else if (ruleConfig.interval > 0){
        const interval = ruleConfig.interval || defaultInterval;
        const intervalRule = setInterval(checkConditionAndNotify, Const.TIME_UNIT * interval);
        rules.set(ruleConfig, intervalRule);
    } else {
        throw 'invalid config: no interval and corn argument';
    }
}

function init() {
    if (initialized) {
        return;
    }
    loadConfig();
    initialized = true;
}

function reload(config) {
    clearAllRule();
    loadConfig(config);
}

function loadConfig() {
    for (const key of Object.keys(config.rule)) {
        addRule(key, config.rule[key]);
    }
}

function clearAllRule() {
    rules.forEach((config, job) => {
        if (config.corn !== undefined) {
            job.cancel();
        } else {
            clearInterval(job);
        }
    })
}

module.exports = {
    reload
}
