const {handleHttpRequest} = require("../utils/request");
const {replaceVariable} = require("../utils/strings");
const jsonpath = require("jsonpath");


async function webhook(notifyConfig, msg) {
    let url = replaceVariable(notifyConfig.url, 'msg', msg);
    if (notifyConfig.body === undefined) {
        notifyConfig.body = '';
    }
    let body = replaceVariable(notifyConfig.body, 'msg', msg);
    const response = await handleHttpRequest(url, notifyConfig.method, body, notifyConfig.headers);
    console.log(response);
}

async function notify(notifyConfig, msg) {
    if (notifyConfig.type === "webhook") {
        await webhook(notifyConfig, msg);
    }
}


function getNotifyConfig(name) {
    try {
        return jsonpath.query(config, `$.notify.${name}`)[0];
    } catch (e) {
        console.error(e, 'invalid notify: ' + name);
    }
}
module.exports = {notify, getNotifyConfig}