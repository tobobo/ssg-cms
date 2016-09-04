window._ = require('lodash');

const socket = window.io();
const params = {};
const PathParser = require('pathparser');
window.Handlebars = require('handlebars/runtime');

_.forEach(
  require('../../app/shared/handlebars_helpers')(),
  (helper, name) => window.Handlebars.registerHelper(name, helper)
);

const router = new PathParser(params);
const app = {socket, router};
window.App = app;

const flashContainer = document.querySelectorAll('.js-flash-container')[0];
app.flash = (type, message) => {
  const flash = message ? {type, message} : type;
  const flashEl = document.createElement('div');
  flashEl.className = `flash ${flash.type}`;
  flashEl.innerHTML = flash.message;
  flashContainer.appendChild(flashEl);
};

_.forEach(window.flashes, app.flash);
delete window.flashes;

require('./routes/upload')(app);
require('./routes/edit')(app);

router.run(window.location.pathname + window.location.search);
