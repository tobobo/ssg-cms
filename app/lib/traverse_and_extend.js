const traverse = require('traverse');

module.exports = (base, newData) => {
  traverse(newData).forEach(function setLeafs(datum) {
    if (this.isLeaf || _.isArray(datum)) _.set(base, this.path, datum);
  });
  return base;
};
