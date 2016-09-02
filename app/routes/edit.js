const root = '../..';
const config = require(`${root}/config`);
const SITE_PATH = config.sitePath;
const _ = require('lodash');
const metaMarked = require('meta-marked');
const YAML = require('yamljs');

const INDEX_PATH = `${SITE_PATH}/contents/index.md`;
const {readFileP, writeFileP} = require(`${root}/app/lib/file_utils`);

function metaMarkToString(metaMarkObj) {
  return `---\n${YAML.stringify(metaMarkObj.meta)}---\n${metaMarkObj.markdown}`;
}

module.exports = app => {
  app.get('/edit', (req, res) => {
    readFileP(INDEX_PATH, 'utf8')
      .then((data) => {
        const page = metaMarked(data.toString());
        page.markdown = _.trim(page.markdown);
        res.render('edit', {page});
      })
      .catch((err) => {
        console.log('err', err);
        res.status(500).send('err!');
      });
  });

  app.post('/edit', (req, res) => {
    readFileP(INDEX_PATH, 'utf8')
      .then(data => {
        const pageData = metaMarked(data.toString());
        _.extend(pageData.meta, req.body.page.meta);
        pageData.markdown = _.trim(req.body.page.markdown);
        return writeFileP(INDEX_PATH, metaMarkToString(pageData));
      })
      .then(() => res.redirect(req.path));
  });
};
