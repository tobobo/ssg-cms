module.exports = app =>
  app.use((req, res, next) => {
    res.locals = _.extend({}, res.locals, {
      currentTime: Date.now(),
      config: app.get('config'),
    });
    next();
  });
