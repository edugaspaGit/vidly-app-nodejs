
//require('express-async-errors');
const winston = require("winston");
//require("winston-mongodb").MongoDB;
//const WinstonMongodb = require("winston-mongodb").MongoDB;

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.metadata(), // include metadata
        winston.format.json(), // format logs as JSON
      ),
    //level: 'error',
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logfile.log' }),
        new winston.transports.MongoDB({
            level: 'error',
            db: 'mongodb://localhost/vidly-db',
            options: {
                useUnifiedTopology: true
            },
            collection: 'logs',
        })
    ]
});

module.exports = function (err, req, res, next) {
    logger.error(err.message, err);
    // 0 - error
    // 1 - warn
    // info
    //verbose
    // debug 
    //silly

    //Log the exception
    res.status(500).send('Something failed');
}