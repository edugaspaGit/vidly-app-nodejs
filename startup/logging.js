
//require('express-async-errors');
const winston = require('winston');

module.exports = function () {    
    // Replaced by winston.exception.handle but for me this approach is better
    // process.on('uncaughtException', (ex) => {
    //     //console.log('We got an Uncaught Exception.');
    //     const logger = winston.createLogger({
    //         transports: [
    //             new winston.transports.Console(),
    //             new winston.transports.File({ filename: 'logfile.log' })
    //         ]
    //     });
    //     logger.error(ex.message);
    //     process.exit(1);
    // })

    //winston.exceptions.handle manages the uncaughtExceptions
    winston.exceptions.handle(
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'uncaughtExceptions.log' }),
        new winston.transports.MongoDB({
            level: 'error',
            db: 'mongodb://localhost/vidly-db',
            options: {
                useUnifiedTopology: true
            },
            collection: 'uncaughtException-logs',
        })
    );

    process.on('unhandledRejection', (ex) => {
        //console.log('We got an Unhandled Rejection.');
        // const logger = winston.createLogger({
        //     transports: [
        //         new winston.transports.Console(),
        //         new winston.transports.File({ filename: 'logfile.log' })
        //     ]
        // });
        // logger.error(ex.message);
        // process.exit(1);
        //replace this code with:
        throw ex;
        // to trigger the winston exceptions handler
    })

    //Testing the uncaught and unhandled Exceptions.
    //throw new Error('Something failed during startup.');
    // const p = Promise.reject(new Error('Something failed miserably!'));
    // p.then(() => console.log('Done'));
}