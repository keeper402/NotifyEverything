const express = require('express');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require("./config/configuration");

// const db = require('./config/db');
// db.sync();
// const router = require('./config/router');
const app = express();
init();

// app.use('/doc', express.static('./doc'));
// app.use(expressValidator());
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());
// app.use(cors());

function init() {
    config.init().then(ignore => {});
}

// router(app);
const port = process.env.port || 3000;
app.listen(port, () => console.log(`Run on port ${port}`));
