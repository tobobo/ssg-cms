const exphbs = require('express-handlebars');

module.exports = app => {
  const viewsDir = 'app/views';
  app.set('views', viewsDir);

  app.engine('.hbs', exphbs({
    defaultLayout: 'app',
    extname: '.hbs',
    layoutsDir: `${viewsDir}/layouts`,
    partialsDir: `${viewsDir}/partials`,
    helpers: {
      get: _.get,
      pathToParam: (path) => {
        const pathSegments = path.split('.');
        return _.reduce(_.tail(pathSegments), (memo, segment) =>
          `${memo}[${segment}]`
        , _.first(pathSegments));
      },
      equal: require('handlebars-helper-equal'),
      json: JSON.stringify,
    },
  }));

  app.set('view engine', '.hbs');
};
