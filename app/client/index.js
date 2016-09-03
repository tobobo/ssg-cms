window._ = require('lodash');

const socket = window.io();
const PathParser = require('pathparser');

const router = new PathParser({});
const app = {socket, router};

app.flash = (type, message) => {
  const flash = message ? {type, message} : type;
  const flashEl = document.createElement('div');
  flashEl.className = `flash ${flash.type}`;
  flashEl.innerHTML = flash.message;
  flashContainer.appendChild(flashEl);
};

const flashContainer = document.querySelectorAll('.js-flash-container')[0];
_.forEach(window.flashes, app.flash);
delete window.flashes;

require('./routes/upload')(app);

router.run(window.location.pathname + window.location.search);
