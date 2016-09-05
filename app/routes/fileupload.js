const Busboy = require('busboy');
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');

module.exports = app => {
  const config = app.get('config');
  app.post('/edit/files', (req, res) => {
    const busboy = new Busboy({headers: req.headers});
    let relFilePath;
    busboy.on('file', (fieldname, file) => {
      relFilePath = fieldname;
      const filePath = path.join(config.sitePath, relFilePath);
      const dirName = path.dirname(filePath);
      mkdirp(dirName, () => file.pipe(fs.createWriteStream(filePath)));
    });

    busboy.on('finish', () => {
      res.json({filename: path.join('images', path.basename(relFilePath))});
    });

    return req.pipe(busboy);
  });
};
