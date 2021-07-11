const configJSON = require('./config.json');

const getConfig = key => {
  try {
    return (
      process.env[key] ??
      ((process.env.NODE_ENV === 'production' && process.env[key]) ||
        (configJSON[process.env.NODE_ENV || 'development'][key] ?? configJSON.common[key]))
    );
  } catch (err) {
    return undefined;
  }
};

// exports your config vars here
// these will be pulled from .env AND config.json

module.exports.MONGODB_URI = getConfig('MONGODB_URI');
// module.exports.JWT_SECRET = getConfig('JWT_SECRET');
// module.exports.SESSION_SECRET = getConfig('SESSION_SECRET');
module.exports.PORT = getConfig('PORT');
module.exports.LOG_LEVEL = getConfig('LOG_LEVEL');
module.exports.PRETTY_LOGS = getConfig('PRETTY_LOGS');
module.exports.REDIS_HOST = getConfig('REDIS_HOST');
module.exports.REDIS_PORT = getConfig('REDIS_PORT');
module.exports.REDIS_PASSWORD = getConfig('REDIS_PASSWORD');
// module.exports.ENABLE_GOOGLE_AUTH = getConfig('ENABLE_GOOGLE_AUTH');
// module.exports.GOOGLE_CLIENT_ID = getConfig('GOOGLE_CLIENT_ID');
// module.exports.GOOGLE_CLIENT_SECRET = getConfig('GOOGLE_CLIENT_SECRET');
