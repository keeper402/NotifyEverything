const ConfigApp = require('./config.routes');

module.exports = app => {
  app.use('/api', ConfigApp);
};
