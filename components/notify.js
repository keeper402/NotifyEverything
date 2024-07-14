const {handleHttpRequest} = require("../utils/request");
const {replaceVariable} = require("../utils/strings");
const jsonpath = require("jsonpath");
const logger = require("../utils/logger");


async function webhook(notifyConfig, msg) {
    let url = replaceVariable(notifyConfig.url, 'msg', msg);
    if (notifyConfig.body === undefined) {
        notifyConfig.body = '';
    }
    let body = replaceVariable(notifyConfig.body, 'msg', msg);
    const response = await handleHttpRequest(url, notifyConfig.method, body, notifyConfig.headers);
    logger.info(response);
}

async function notify(notifyConfig, msg, context) {
    if (notifyConfig.type === "webhook") {
        await webhook(notifyConfig, msg);
    }
}


function getNotifyConfig(name) {
    try {
        return jsonpath.query(config, `$.notify.${name}`)[0];
    } catch (e) {
        logger.error(e, 'invalid notify: ' + name);
    }
    return undefined;
}
module.exports = {notify, getNotifyConfig}