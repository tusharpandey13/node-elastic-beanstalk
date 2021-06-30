const path = require('path');
// set global vars that are not available in es6
global.__dirname = path.resolve('./');

require('dotenv').config({ path: __dirname + '/../.env' });

const express = require('express');
const loaders = require('./loaders');
const loggerFactory = require('./utils/logger');

global.__logger = loggerFactory({});

// loaders init
loaders(express());
