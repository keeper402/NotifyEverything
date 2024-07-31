const AuthController = require('./auth.controller.js');
const app = require('express')();

app.post('/login', AuthController.loginValidator, AuthController.login);
app.post('/changePassword', AuthController.changePassValidator, AuthController.changePass);

module.exports = app;
