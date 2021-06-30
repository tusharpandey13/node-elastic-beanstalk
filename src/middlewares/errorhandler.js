const CustomError = require('../utils/customError');
const HttpStatus = require('http-status-codes');

/**
 * Error response middleware for 404 not found.
 */
module.exports.notFound = (req, res, next) => {
  return res.render('404', {});
  // return next(
  //   new CustomError({
  //     message: HttpStatus.getStatusText(HttpStatus.NOT_FOUND),
  //     status: HttpStatus.NOT_FOUND,
  //     logLevel: 'warn',
  //   })
  // );
};

/**
 * Generic error response middleware for validation and internal server errors.
 */
module.exports.genericErrorHandler = (err, req, res, next) => {
  let tmperr;

  let errParams = { err: err };

  if (err instanceof CustomError) {
    tmperr = err;
  } else {
    // Validation errors
    if (err.name === 'ValidationError' || err.isJoi) {
      errParams = {
        ...errParams,
        ...{
          status: HttpStatus.BAD_REQUEST,
        },
      };
    } else if (err.name === 'UnauthorizedError') {
      errParams = {
        ...errParams,
        ...{
          message: 'Invalid token',
          status: HttpStatus.UNAUTHORIZED,
        },
      };
    }

    tmperr = new CustomError(errParams);
  }

  __logger.log(tmperr.severity, tmperr.message, {
    path: req.originalUrl,
    method: req.method,
    ...tmperr.toString(),
    UA: req.headers['user-agent'],
    origin: req.headers.origin,
  });

  return res.status(tmperr.status).json(tmperr.toResponseJSON());
};
