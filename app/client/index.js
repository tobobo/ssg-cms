window._ = require('lodash');

const socket = window.io();
const params = {};
const PathParser = require('pathparser');
const handlebars = window.Handlebars = require('handlebars/runtime');

_.forEach(
  require('../../app/shared/handlebars_helpers')(),
  (helper, name) => handlebars.registerHelper(name, helper)
);

const router = new PathParser(params);
const app = {socket, router, handlebars};
window.App = app;

const flashContainer = document.querySelector('.js-flash-container');
app.flash = (typeOrFlash, message) => {
  const flash = message ? {type: typeOrFlash, message} : typeOrFlash;
  const flashEl = document.createElement('div');
  flashEl.innerHTML = handlebars.partials.flash({flash});
  flashContainer.appendChild(flashEl);
};

_.forEach(window.flashes, app.flash);
delete window.flashes;

require('./routes/upload')(app);
require('./routes/edit')(app);

document.addEventListener('DOMContentLoaded', () =>
  router.run(window.location.pathname + window.location.search)
);
