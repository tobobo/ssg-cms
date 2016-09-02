const root = '../..';
const express = require('express');

const config = require(`${root}/config`);

module.exports = app => {
  app.use(`/${config.editBasePath}/public`, express.static('app/public'));
};
