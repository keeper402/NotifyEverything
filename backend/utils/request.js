const axios = require('axios')
const logger = require("./logger");

function doHttpRequest(url, method, body, headers) {
    if (typeof headers === 'string') {
        headers = JSON.parse(headers);
    }
    return new Promise((resolve, reject) => {
        axios.request({
            url: url,
            method: method,
            headers: headers,
            data: body
        })
            .then(res => {
                logger.info(`状态码: ${res.status}, data: ${JSON.stringify(res.data)}`);
                resolve(res);
            })
            .catch(error => {
                logger.error(error);
            })

    });
}

async function handleHttpRequest(url, method, body, headers) {
    const response = await doHttpRequest(url, method, body, headers);
    if (response === undefined) {
        return undefined;
    }
    if (response.status !== 200) {
        logger.error(`response returned status ${response.status} and body: ${JSON.stringify(response)}`);
    }
    return response.data;
}

async function get(url, headers) {
    return await handleHttpRequest(url, 'GET', '', headers);
}

async function post(url, body, headers) {
    return await handleHttpRequest(url, 'POST', body, headers);
}

module.exports = {
    doHttpRequest, get, post, handleHttpRequest
}