module.exports = () => ({
  get: (obj, path) => _.get(obj, path),
  pathToParam: (path) => {
    const pathSegments = path.split('.');
    return _.reduce(_.tail(pathSegments), (memo, segment) =>
      `${memo}[${segment}]`
    , _.first(pathSegments));
  },
  equal: require('handlebars-helper-equal'),
  json: data => {
    if (data.name && data.hash && data.data) return JSON.stringify(data.hash);
    return JSON.stringify(data);
  },
  concat: (...args) =>
    _.join(args.slice(0, -1), ''),
  keys: Object.keys,
});
