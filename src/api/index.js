const crudControllerClass = require('../utils/crud/crud.controller');
const model = require('../models/url');
const crudController = new crudControllerClass({ model });
const validUrl = require('valid-url');
const fs = require("fs");
const path = require("path");

module.exports = async (app, db) => {
    // test
    app.get('/status', (req, res) => {
        res.status(200).send('hi!!');
    });

    app.get('/logs', (req, res) => {
        fs.readFile("./logfile.log","utf8" ,function(err, contents){
          res.json({
            file: contents
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

    app.get('/getall', await crudController.get({}));

    app.get('/', async (req, res, next) => {
        try {
            res.render('home', {});
        } catch (err) {
            next(err);
        }
    });

    // // endpoint to clear DB and session cache. Enable with care!!!
    app.get('/cleardb', async (req, res) => {
        try {
            await db.dropDatabase(console.log(`${db.databaseName} database dropped.`));
            // session.redisClient.flushdb(function (err, succeeded) {
            //   console.log(succeeded); // will be true if successfull
            //   console.log(err);
            // });
            res.send('Ok');
        } catch (err) {
            res.send(err);
        }
    });

    app.get('/:urlCode', async (req, res, next) => {
        try {
            const tmp = await crudController.get({
                idfield: 'urlCode',
                returnMiddleware: false,
                data: req,
            });
            return res.redirect(tmp.result[0].longUrl);
        } catch (error) {
            next(error);
        }
    });
};