// Index.js main program
require('express-async-errors'); //by now, this must be here to trigger the genres error in the error.js module
require("winston-mongodb").MongoDB;//same as the above
const winston = require('winston');
const express = require('express');
const app = express();

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

const port = process.env.PORT || 3000;
const server = app.listen(port, () => logger.info(`Listening to Port ${port}...`));

module.exports = server;
