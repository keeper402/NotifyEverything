const express = require('express');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const cors = require('cors');
const config = require("./config/configuration");
const logger = require("./utils/logger");

// const db = require('./config/db');
// db.sync();
const router = require('./config/router');
const {authValidator} = require("./components/api/auth/auth.service");
const app = express();
init();

// app.use('/doc', express.static('./doc'));
app.use(expressValidator());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// app.use(cors());
app.use(cookieParser());
app.use(authValidator);

function init() {
    config.init().then(ignore => {});
}

router(app);
const port = process.env.port || 3000;
app.listen(port, () => console.log(`Run on port ${port}`));

// global exception handle
process.on('uncaughtException',function(err){
    logger.error('未捕获的异常', err);
})

process.on('unhandledRejection', function (err, promise) {
    logger.error('有Promise没有被捕获的失败函数', err);
})