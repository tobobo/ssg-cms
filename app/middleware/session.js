const session = require('express-session');

module.exports = app =>
  app.use(session({
    secret: 'keyboard cat',
    cookie: {maxAge: 60000},
  }));
