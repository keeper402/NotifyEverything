require('mocha');
const logger = require("../utils/logger");

describe('日志测试', () => {

    it("日志测试", async ()=>{

        logger.info('Hello, Winston!');
        logger.error('Oops, something went wrong!');
        try {
            JSON.parse('');
        } catch (e) {
            logger.error(e);
        }

    })
})