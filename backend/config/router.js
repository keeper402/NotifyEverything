const auth = require('../components/api/auth');
const config = require('../components/api/config');

module.exports = app => {
  const components = [auth, config];
  components.forEach(component => {
    component(app);
  });
};
