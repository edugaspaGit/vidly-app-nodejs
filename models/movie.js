
const {genreSchema} = require('../models/genre');
const mongoose = require('mongoose');
const Joi = require('joi');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlenght: 5,
        maxlenght: 50
    },
    genre: {
        type: genreSchema,    
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
});

const Movie = mongoose.model('Movie', movieSchema);

 function validateMovie(movie) {
     const schema = {
         title: Joi.string().min(3).required(),
         genreId: Joi.objectId().required(),
         numberInStock: Joi.number().min(0).required(),
         dailyRentalRate: Joi.number().min(0).required()
     };
     return Joi.validate(movie, schema);
 }

  module.exports.Movie = Movie;
 module.exports.validateMovie = validateMovie;