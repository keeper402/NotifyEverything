const {handleHttpRequest} = require("../../utils/request");
const {replaceVariable} = require("../../utils/strings");
const jsonpath = require("jsonpath");
const logger = require("../../utils/logger");
const {sendMail} = require("../../support/mailer");


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

async function notify(notifyConfig, msg, context) {
    if (notifyConfig.type === "webhook") {
        await webhook(notifyConfig, msg, context);
    } else if (notifyConfig.type === "mail") {
        await mail(notifyConfig, msg, context);
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