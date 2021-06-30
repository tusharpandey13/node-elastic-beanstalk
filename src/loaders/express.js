const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const eta = require('eta');
const path = require('path');

const routes = require('../api');
const errorhandler = require('../middlewares/errorhandler');

module.exports = async (app, db) => {
  // cors, helmet, compression
  await app.use(cors());
  await app.use(helmet());
  await app.use(
    compression({
      filter: (req, res) => {
        if (req.headers['x-no-compression']) return false;
        return compression.filter(req, res);
      },
    })
  );
  // json, urlencoded
  await app.use(express.urlencoded({ extended: true }));
  await app.use(express.json());

  await app.engine('eta', eta.renderFile);
  await app.set('view engine', 'eta');
  await app.set('views', path.join(__dirname, '/../views/'));
  await app.use('/favicon.ico', express.static('src/public/favicon.ico'));
  await app.use(express.static('src/public'));

  // custom request logger middleware
  await app.use(async (req, res, next) => {
    __logger.http(
      `${req.method}  ${req.path}  ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}`
    );
    next();
  });

  // Routes
  await routes(app, db);

  // Error Middleware
  app.use(errorhandler.notFound);
  app.use(errorhandler.genericErrorHandler);
};
