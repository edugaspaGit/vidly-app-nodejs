
const express = require('express');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auths = require('../routes/auths');
const error = require('../middleware/error');


module.exports = function (app) {

    //Use to read and manage Json expressions
    app.use(express.json());

    //Use the router to modularize the app: Call the CRUD for Genres
    app.use('/api/genres', genres);

    //Use the router to modularize the app: Call the CRUD for Customers
    app.use('/api/customers', customers);

    //Use the router to modularize the app: Call the CRUD for Movies
    app.use('/api/movies', movies);

    //Use the router to modularize the app: Call the CRUD for Rentals
    app.use('/api/rentals', rentals);

    //Use the router to modularize the app: Call the CRUD for Users
    app.use('/api/users', users);

    //Use the router to modularize the app: Call the Loggin Auth
    app.use('/api/auths', auths);

    //Logging Exceptions
    app.use(error);

}