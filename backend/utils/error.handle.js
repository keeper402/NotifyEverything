const {getNotifyConfig, notify} = require("../components/notify");
const {DEFAULT_ERROR_NOTIFY_MSG} = require("../config/const");
const logger = require("./logger");

function handleFunctionError(f) {
    try {
        return f();
    } catch (e) {
        handleError(e);
        return undefined;
    }
}

function handleError(e, msg) {
    logger.error(msg, e);
    notifyError(e, msg).then();
}

// params for eval template string
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

module.exports = {handleError, handleFunctionError};