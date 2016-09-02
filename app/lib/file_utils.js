const fs = require('fs');
const nodefn = require('when/node');

module.exports = {
  readFileP: nodefn.lift(fs.readFile),
  writeFileP: nodefn.lift(fs.writeFile),
};
