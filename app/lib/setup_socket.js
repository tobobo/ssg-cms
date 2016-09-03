const createSocket = require('socket.io');

module.exports = httpServer => {
  const socket = createSocket(httpServer);
  return socket;
};
