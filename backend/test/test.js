const {DEFAULT_ERROR_NOTIFY_MSG} = require("../config/const");
const lodash = require('lodash');

function testTemplateString() {
    let e;
    try {
        const a = JSON.parse('');
    } catch (err) {
        e = err;
    }
    const errMsg = '123';
    const msg = eval('`' + DEFAULT_ERROR_NOTIFY_MSG + '`');
    console.log(msg);
}


console.info(lodash.isEmpty(''));
