module.exports = app => {
  app.router.add('/edit/:editor', function editor() {
    console.log('editor');
  });
};
