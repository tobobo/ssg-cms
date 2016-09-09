const Busboy = require('busboy');
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');

module.exports = app => {
  const config = app.get('config');
  app.post('/edit/files', (req, res) => {
    const busboy = new Busboy({headers: req.headers});
    const filePath = req.headers['x-file-path'];
    const fileBasePath = req.headers['x-file-base-path'];

    busboy.on('file', (fieldname, file) => {
      const fileWritePath = path.join(config.siteDir, fileBasePath, filePath);
      const dirName = path.dirname(fileWritePath);
      mkdirp(dirName, () => file.pipe(fs.createWriteStream(fileWritePath)));
    });

    busboy.on('finish', () => {
      res.json({filePath});
    });

    return req.pipe(busboy);
  });
};
