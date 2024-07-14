const {getNotifyConfig, notify} = require("../components/notify");
const {DEFAULT_ERROR_NOTIFY_MSG} = require("../config/const");
const logger = require("./logger");

function handle(f) {
    try {
        f();
    } catch (e) {
        handleError(e);
    }
}

function handleError(e, msg) {
    logger.error(e, msg);
    notifyError(e, msg).then();
}

async function notifyError(e, errMsg) {
    const notifyName = config.errorNotify;
    const notifyConfig = getNotifyConfig(notifyName);
    if (notifyConfig === undefined) {
        return;
    }
    const msg = config.errorNotifyMsg === undefined ? '`' + DEFAULT_ERROR_NOTIFY_MSG + '`' : '`' + config.errorNotifyMsg + '`';
    await notify(notifyConfig, eval(msg));
}

async function notifyMsg(errMsg) {
    const notifyName = config.errorNotify;
    const notifyConfig = getNotifyConfig(notifyName);
    if (notifyConfig === undefined) {
        return;
    }
    await notify(notifyConfig, errMsg);
}

module.exports = {handleError};