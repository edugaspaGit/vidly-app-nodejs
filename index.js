// Index.js main program
require('express-async-errors'); //by now, this must be here to trigger the genres error in the error.js module
require("winston-mongodb").MongoDB;//same as the above
const winston = require('winston');
const express = require('express');
const app = express();

// Add middleware to enable CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),        
    ]
});

require('./startup/logging')(); //uncaught & unhandled Exceptions
require('./startup/routes')(app); //Routes
require('./startup/db')(); //DB
require('./startup/config')();//Config
require('./startup/validation')();//Joi validations

const port = process.env.PORT || 3900;
const server = app.listen(port, () => logger.info(`Listening to Port ${port}...`));

module.exports = server;
