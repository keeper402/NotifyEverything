const ConfigController = require('./config.controller.js');
const app = require('express')();

app.post('/config/save', ConfigController.save);
app.get('/config/get', ConfigController.get);

module.exports = app;
