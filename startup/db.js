
const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),        
    ]
});

//Vidly DB connection
module.exports = function () {
    const db = config.get('db');
    mongoose.connect(db)
        .then(() => logger.info(`Connected to ${db}`)) //winston.info('Connected to MongoDB...'))               
        .catch(err => logger.error(`Could not connect to ${db}...`)) //console.error('Could not connect to MongoDB...', err));
}    

