const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: true});

module.exports = app => {
  app.use((req, res, next) => {
    if (_.includes(['POST', 'PUT'], req.method)) return urlencodedParser(req, res, next);
    return next();
  });
};
