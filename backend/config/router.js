const auth = require('../components/api/auth');

module.exports = app => {
  const components = [auth];
  components.forEach(component => {
    component(app);
  });
};
