const {handleHttpRequest} = require("../../utils/request");
const {replaceVariable} = require("../../utils/strings");
const jsonpath = require("jsonpath");
const logger = require("../../utils/logger");
const {sendMail} = require("../../support/mailer");
const lodash = require("lodash");
const request = require("../../utils/request");
const {evaluate} = require("../../utils/evaluate");


async function webhook(notifyConfig, msg, context) {
    let url = replaceVariable(notifyConfig.url, 'msg', msg);
    if (notifyConfig.body === undefined) {
        notifyConfig.body = '';
    }
    let body = replaceVariable(notifyConfig.body, 'msg', msg);
    const response = await handleHttpRequest(url, notifyConfig.method, body, notifyConfig.headers);
    logger.info(response);
}

async function mail(mailConfig, msg, context) {
    const subject = eval('`'+ mailConfig.title + '`')
    const text = eval('`'+ mailConfig.text + '`')
    await sendMail(mailConfig, subject, text);
}

async function js(notifyConfig, msg, context) {
    let param = null;
    if (!lodash.isEmpty(notifyConfig.param)) {
        param = JSON.parse(notifyConfig.param);
    }
    const script = await request.handleHttpRequest(notifyConfig.url, 'GET', '');
    return await evaluate(script, param, context);
}

async function notify(notifyConfig, msg, context) {
    if (notifyConfig.type === "webhook") {
        await webhook(notifyConfig, msg, context);
    } else if (notifyConfig.type === "mail") {
        await mail(notifyConfig, msg, context);
    } else if (notifyConfig.type === "js") {
        await js(notifyConfig, msg, context);
    }
}


function getNotifyConfig(name) {
    try {
        return jsonpath.query(config, `$.notify.${name}`)[0];
    } catch (e) {
        logger.error('invalid notify: ' + name, e);
    }
    return undefined;
}
module.exports = {notify, getNotifyConfig}