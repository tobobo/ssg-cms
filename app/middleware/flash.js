module.exports = app =>
  app.use((req, res, next) => {
    req.flash = (type, message) => {
      if (!req.session.flashes) req.session.flashes = [];
      req.session.flashes.push({type, message});
    };
    if (req.session.flashes) {
      res.locals = _.extend({}, res.locals, {
        flashes: req.session.flashes,
      });
      delete req.session.flashes;
    }
    next();
  });
