const axios = require('axios')

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
                console.log(`状态码: ${res.status}`)
                console.log(res)
                resolve(res);
            })
            .catch(error => {
                console.error(error);
                reject(error);
            })

    });
}

async function handleHttpRequest(url, method, body, headers) {
    try {
        const response = await doHttpRequest(url, method, body, headers);
        if (response.status !== 200) {
            // todo send error notify
            console.error(`response returned status ${response.status} and body: ${JSON.stringify(response)}`);
        }
        return response.data;
    } catch (err) {
        // todo send error notify
        console.error(err);
    }
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