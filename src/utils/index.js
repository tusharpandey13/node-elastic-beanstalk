//this also stops someone scrolling back and viewing sensitive data that may have been logged
module.exports.clearConsoleAndScrollbackBuffer = () => {
  process.stdout.write('\u001b[3J\u001b[2J\u001b[1J');
  console.clear();
};

module.exports.normalizePort = val => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
};
