const mongooseLoader = require('./mongoose');
const expressLoader = require('./express');
const serverLoader = require('./server');

const loader = async application => {
  // load mongoose
  const db = await mongooseLoader();

  // load express
  await expressLoader(application, db);

  // load server
  await serverLoader(application);
};

module.exports = loader;
