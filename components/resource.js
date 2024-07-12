const request = require('../utils/request');
const jsonpath = require('jsonpath');

function getResourceConfig(name) {
    try {
        return jsonpath.query(global.config, `$.resource.${name}`)[0];
    } catch (e) {
        console.error(e, 'invalid resource: ' + name);
    }
}

function getResourceCall(resourceConfig) {
    if (resourceConfig.type === 'rest') {
        return () => {
            return rest(resourceConfig);
        }
    }
    return undefined;
}

async function rest(restConfig) {
    const data = await request.handleHttpRequest(restConfig.url, restConfig.method, restConfig.body, restConfig.headers);
    const result = jsonpath.query(data, restConfig.result);
    console.log(result);
    return result;
}

module.exports = {rest, getResourceConfig, getResourceCall}