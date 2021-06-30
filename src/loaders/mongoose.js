const MONGODB_URI = require('../config').MONGODB_URI;

const mongoose = require('mongoose');
const bluebird = require('bluebird');
const fs = require('fs');

// makes ops like filter() easier
mongoose.Promise = bluebird;

module.exports = async () => {
  // Connect to MongoDB
  const connection = await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  const _dirname = fs.realpathSync('.');
  const modelDir = _dirname + '/src/models';
  fs.readdirSync(modelDir).forEach(async file => {
    if (~file.indexOf('.js')) await import(modelDir + '/' + file);
  });

  __logger.log('info', '✌️ DB loaded and connected!');

  // returns promise
  return connection.connection.db;
};
