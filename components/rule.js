const notify = require("./notify");
const Const = require("../config/const");
const schedule = require("node-schedule");
const {getResourceConfig, getResourceCall} = require("./resource");
const {replaceVariables} = require("../utils/strings");
const compareConfig = require("../support/compare");
const {handleError} = require("../utils/error.handle");
const logger = require("../utils/logger");

let ruleJobs = new Map();
let rules = new Map();
let defaultInterval = 30;

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
    ruleConfig.context = {
        ruleName: ruleName,
        allTimes: 0,
        notifyTimes: 0,
        errorTimes: 0,
        timestamp: null,
        lastNotify: null,
        lastCheckCondition: null,
    }
    //map resourceName => getResource function
    let getResourceMap = new Map();
    for (let resourceName of resourceNames) {
        const resourceConfig = getResourceConfig(resourceName);
        let resourceCall = getResourceCall(resourceConfig, ruleConfig.context);
        if (resourceCall !== undefined) {
            getResourceMap.set(resourceName, resourceCall);
        }
    }

    // Closure for checkAndNotify
    const checkConditionAndNotify = async function () {
        const context = ruleConfig.context;
        try {
            context.allTimes++;
            let resourceValues = new Map();
            for (let key of getResourceMap.keys()) {
                const resource = await getResourceMap.get(key)();
                resourceValues.set(key, resource);
            }
            // replace resource var
            let condition = replaceVariables(ruleConfig.condition, resourceValues);
            let msg = replaceVariables(ruleConfig.msg, resourceValues);
            context.timestamp = Date.now();
            // check condition
            const checkCondition = eval(condition);
            context.lastCheckCondition = Date.now();
            if (checkCondition === true) {
                const notifyConfig = notify.getNotifyConfig(ruleConfig.notify)
                const lastTime = lastNotify.get(ruleName);
                // check muteAfterNotify
                if (lastTime !== undefined && lastTime - Date.now() < ruleConfig.muteAfterNotify * Const.TIME_UNIT) {
                    logger.log(`now: ${new Date()}, rule: ${ruleName} in mute period. Notify will be sent after ${new Date(lastTime + ruleConfig.muteAfterNotify * Const.TIME_UNIT)}`);
                    return;
                }
                // do notify
                await notify.notify(notifyConfig, msg, context);
                const now = Date.now();
                context.lastNotify = now;
                context.notifyTimes++;
                lastNotify.set(ruleName, now);
            }
        } catch (e) {
            context.errorTimes++;
            handleError(e, `error happened when execute rule ${ruleName}`);
        }
    };
    if (ruleConfig.cron !== undefined) {
        const scheduleJob = schedule.scheduleJob(ruleConfig.cron, checkConditionAndNotify);
        ruleJobs.set(ruleName, scheduleJob);
    } else if (ruleConfig.interval > 0) {
        const interval = ruleConfig.interval || defaultInterval;
        const intervalRule = setInterval(checkConditionAndNotify, Const.TIME_UNIT * interval);
        ruleJobs.set(ruleName, intervalRule);
    } else {
        throw 'invalid config: no interval and cron argument';
    }
    rules.set(ruleName, ruleConfig);
}

function reload(oldConfig, newConfig) {
    const compareResult = compareConfig(oldConfig, newConfig);
    for (let toDeleteElement of compareResult.ruleReload.toDelete) {
        stopRule(toDeleteElement);
    }
    for (let toUpdateElement of compareResult.ruleReload.toUpdate) {
        stopRule(toUpdateElement);
        addRule(toUpdateElement, newConfig.rule[toUpdateElement]);
    }
    for (let toCreateElement of compareResult.ruleReload.toCreate) {
        addRule(toCreateElement, newConfig.rule[toCreateElement]);
    }
}

function stopRule(ruleName) {
    const rule = rules.get(ruleName);
    if (rule.cron !== undefined) {
        ruleJobs.get(ruleName).cancel();
    } else {
        clearInterval(ruleJobs.get(ruleName));
    }
    ruleJobs.delete(ruleName);
}

function clearAllRule() {
    ruleJobs.forEach((ruleName, job) => stopRule(ruleName));
    ruleJobs.clear();
}

module.exports = {
    reload
}
