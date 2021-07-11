const crudControllerClass = require('../utils/crud/crud.controller');
const model = require('../models/url');
const crudController = new crudControllerClass({ model });
const validUrl = require('valid-url');
const fs = require('fs');
const util = require('util');
const redis = require('redis');

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = require('../config');

const redisClient = redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
});
redisClient.get = util.promisify(redisClient.get);
redisClient.set = util.promisify(redisClient.set);
redisClient.on('error', function (error) {
  __logger.error(error);
});

module.exports = async (app, db) => {
  // test
  app.get('/status', (req, res) => {
    res.status(200).send('hi!!');
  });

  app.get('/logs', (req, res) => {
    fs.readFile('./logfile.log', 'utf8', function (err, contents) {
      res.json({
        file: contents,
      });
    });
  });

  app.post('/shorten', await crudController.create({}));

  app.post('/shortenbrowser', async (req, res, next) => {
    try {
      const isValid = validUrl.isWebUri(req.body.longUrl);
      if (isValid) {
        const tmpdoc = await crudController.create({
          returnMiddleware: false,
          data: { body: { longUrl: req.body.longUrl } },
        });
        return res.render('result', {
          shortUrl: `${req.protocol}://${req.headers.host}/${tmpdoc.result.urlCode}`,
          urlCode: tmpdoc.result.urlCode,
          protocol: req.protocol,
        });
      } else {
        return res.render('result', {
          error: 'Please enter a correct HTTP/HTTPS url',
        });
      }
    } catch (err) {
      next(err);
    }
  });

  // app.get('/getall', await crudController.get({}));

  app.get('/', async (req, res, next) => {
    try {
      res.render('home', {});
    } catch (err) {
      next(err);
    }
  });

  // endpoint to clear DB and session cache. Enable with care!!!
  app.get('/cleardb', async (req, res) => {
    try {
      await db.dropDatabase(console.log(`${db.databaseName} database dropped.`));
      redisClient.flushdb(function (err, succeeded) {
        console.log(succeeded); // will be true if successfull
        console.log(err);
        res.json({ succeeded, err });
      });
    } catch (err) {
      res.send(err);
    }
  });

  app.get('/:urlCode', async (req, res, next) => {
    try {
      let result = await redisClient.get(req.params.urlCode);
      if (result) {
        __logger.info(`got cached ${result}`);
      } else {
        result = (
          await crudController.get({
            idfield: 'urlCode',
            returnMiddleware: false,
            data: req,
          })
        ).result[0].longUrl;
        __logger.info(`caching ${result}`);
        if (result) redisClient.set(req.params.urlCode, result);
      }
      return res.redirect(result);
    } catch (error) {
      if (error.message.includes("Cannot read property 'longUrl' of undefined")) {
        return res.render('404', {});
      } else return next(error);
    }
  });
};
