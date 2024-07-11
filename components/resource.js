const request = require('../utils/request');
const jsonpath = require('jsonpath');
const {evaluate} = require("../utils/evaluate");
const logger = require("../utils/logger");
const lodash = require('lodash');
const {handleFunctionError} = require("../utils/error.handle");

function getResourceConfig(name) {
    try {
        return jsonpath.query(global.config, `$.resource.${name}`)[0];
    } catch (e) {
        logger.error('invalid resource: ' + name, e);
    }
}

function getResourceCall(resourceConfig, ruleContext) {
    if (resourceConfig.type === 'rest') {
        return () => {
            return handleFunctionError(() => rest(resourceConfig));
        }
    } else if (resourceConfig.type === 'js') {
        return () => {
            return handleFunctionError(() => jsScript(resourceConfig, ruleContext));
        }
    }
    return undefined;
}

async function rest(restConfig) {
    const data = await request.handleHttpRequest(restConfig.url, restConfig.method, restConfig.body, restConfig.headers);
    const result = jsonpath.query(data, restConfig.result);
    logger.info(result);
    return result;
}

async function jsScript(jsConfig, ruleContext) {
    let param = null;
    if (!lodash.isEmpty(jsConfig.param)) {
        param = JSON.parse(jsConfig.param);
    }
    const script = await request.handleHttpRequest(jsConfig.url, 'GET', '');
    return await evaluate(script, param, ruleContext);
}

module.exports = {getResourceConfig, getResourceCall}