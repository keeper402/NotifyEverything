const ConfigController = require('./config.controller.js');
const app = require('express')();

app.post('/config/save', ConfigController.save);
app.get('/config/get', ConfigController.get);

app.post('/config/saveEncrypt', ConfigController.saveEncrypt);
app.get('/config/getEncrypt', ConfigController.getEncrypt);

module.exports = app;
