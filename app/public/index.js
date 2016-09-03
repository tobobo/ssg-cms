const socket = window.io();
const PathParser = require('pathparser');

const router = new PathParser({});
const app = {socket, router};

require('./routes/upload')(app);

router.run(window.location.pathname + window.location.search);
