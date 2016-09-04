module.exports = () => ({
  get: _.get,
  pathToParam: (path) => {
    const pathSegments = path.split('.');
    return _.reduce(_.tail(pathSegments), (memo, segment) =>
      `${memo}[${segment}]`
    , _.first(pathSegments));
  },
  equal: require('handlebars-helper-equal'),
  json: JSON.stringify,
  concat: (...args) =>
    _.join(args.slice(0, -1), ''),
});
