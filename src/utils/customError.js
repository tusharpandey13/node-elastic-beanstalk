const HttpStatus = require('http-status-codes');
// const { cleanStack } = require('clean-stack');
const colors = require('colors');
const PRETTY_LOGS = require('../config').PRETTY_LOGS;

class CustomError extends Error {
  constructor({
    message = HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR),
    status = HttpStatus.INTERNAL_SERVER_ERROR,
    details = undefined,
    err = undefined,
    logLevel = 'error',
  }) {
    // Calling parent constructor of base Error class.
    if (err) {
      super(err.message ?? message, err.filename, err.lineNumber);
    } else {
      super(message);
    }

    // Saving class name in the property of our custom error as a shortcut.
    this.name = this.constructor.name;

    this.message = err ? err.message ?? message : message;
    this.details = details ?? (err && err.errors && err.errors) ?? (err && err.details && err.details);
    this.status = err ? err.status ?? status : status;
    this.severity = err ? err.logLevel ?? logLevel : logLevel;

    Error.stackTraceLimit = 20;
    Error.captureStackTrace(this, this.constructor);
    // this.stack = cleanStack(this.stack, { basePath: __dirname });
  }

  toString() {
    if (process.env['NODE_ENV'] !== 'production') {
      return {
        ...(this.details && { details: this.details }),
        stack: this.stack,
      };
    }
    return {};
  }

  toResponseJSON() {
    return {
      success: false,
      status: this.status,
      message: this.message,
      ...(this.details && { details: this.details }),
      severity: this.severity,
    };
  }
}

module.exports = CustomError;
