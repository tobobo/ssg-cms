const root = '../..';
const handlebarsHelpers = require(`${root}/app/shared/handlebars_helpers`);
const exphbs = require('express-handlebars');

module.exports = app => {
  const viewsDir = 'app/views';
  app.set('views', viewsDir);

  const templates = exphbs.create({
    defaultLayout: 'app',
    extname: '.hbs',
    layoutsDir: `${viewsDir}/layouts`,
    partialsDir: `${viewsDir}/partials`,
    helpers: handlebarsHelpers(),
  });

  app.engine('.hbs', templates.engine);
  app.set('view engine', '.hbs');
};
