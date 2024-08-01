const AuthApp = require('./auth.routes');

module.exports = app => {
  app.use('/api', AuthApp);
};
