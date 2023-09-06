// Index.js main program
require('express-async-errors'); //by now, this must be here to trigger the genres error in the error.js module
require("winston-mongodb").MongoDB;//same as the above
const winston = require('winston');
const express = require('express');
const app = express();
const cors = require('cors'); 

// Add middleware to enable CORS
// Enable CORS with specific headers
const corsOptions = {
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these HTTP methods
    allowedHeaders: 'Content-Type, x-auth-token', // Allow these headers
};

app.use(cors(corsOptions));

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'x-auth-token');
//     next();
// });

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
