const createSocket = require('socket.io');

module.exports = app => {
  app.set('socketIo', createSocket(app.get('server')));
};
