const root = '../..';
const config = require(`${root}/config`);

module.exports = app => {
  app.get('/', (req, res) => res.render('editors', {editors: config.editors}));
};
