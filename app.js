require('dotenv').config()
// Get dependencies
const express = require('express');
const morgan = require('morgan');
const fs = require("fs");


const app = express();
const server = require('http').Server(app);
port = process.env.PORT || 8080;

// Catch all other routes and return the index file
app.get('/', (req, res) => {
  fs.readFile(".env","utf8" ,function(err, contents){
  res.send(contents);
 });
});

// use morgan to log requests to the console
app.use(morgan('dev'));

server.listen(port);
console.log('App running at http://localhost:' + port);
