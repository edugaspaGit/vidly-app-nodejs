
const auth = require('../middleware/auth');
const {Movie, validateMovie} = require('../models/movie');
const mongoose = require('mongoose');
const express = require('express');
const { Genre } = require('../models/genre');
const router = express.Router();


//Get all Movies
router.get('/', async (req, res)=> {    
    const movies =  await Movie.find().sort('title');
    res.send(movies);
});

//Get a single movie
router.get('/:id', async (req, res)=> {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('Movie not found.');
    res.send(movie);
});

//Create a single movie
router.post('/', auth, async (req, res)=> {    

    const { error } = validateMovie(req.body);    
    if (error) return res.status(400).send(error.details[0].message);        
        
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send('Genre not found.');
    
    const movie = new Movie({ 
        title: req.body.title, 
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate 
    });
    await movie.save();    
    res.send(`Movie created correctly: ${movie}.`);
});

//Modify a movie
router.put('/:id', async (req, res)=> {
    
    const { error } = validateMovie(req.body);    
    if (error) return res.status(400).send(error.details[0].message);  
    
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send('Genre not found.');

    const movie = await Movie.findByIdAndUpdate( req.params.id, { $set: {
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
        }}, { new: true } );
        
    if (!movie) return res.status(404).send('Movie not found.');  
    
    res.send(`Movie updated correctly: ${movie}.`);

});

//Delete a movie
router.delete('/:id', async (req, res)=> {
    
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) return res.status(404).send('Movie not found.');           

    res.send(`Movie deleted correctly: ${movie.title}.`);   

});

module.exports = router;