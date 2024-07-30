const AuthController = require('./auth.controller.js');
const app = require('express')();

app.post('/login', AuthController.loginValidator, AuthController.login);

module.exports = app;
