
//const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Genre, validateGenre } = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const validateObjectId = require('../middleware/validateObjectId');
const router = express.Router();

// const genreSchema = new mongoose.Schema({
//     //_id: Number,
//     name: {
//         type: String,
//         required: true,
//         minlenght: 4,
//         maxlenght: 50
//     }
// });

//Define Genres
// const genres = [
//     {id: 1, name: 'Classics' },
//     {id: 2, name: 'Action' },
//     {id: 3, name: 'Thriller' },
//     {id: 4, name: 'Comedy' },
//     {id: 5, name: 'Horror' },
//     {id: 6, name: 'Drama' },
// ];

//Get all genres 
//Alternative way calling a middleware function to handle errors
router.get('/', async (req, res) => {
    //throw new Error('Could not get the genres.');            
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

//Alternative way calling a middleware function to handle errors
// router.get('/', asyncMiddleware(async (req, res) => {
//     const genres = await Genre.find().sort('name');
//     res.send(genres);
// }));

//Get a single genre
router.get('/:id', validateObjectId, async (req, res) => {
    //Replaced in validateObjectId.js
    // if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    //     return res.status(404).send('Invalid ID.');
    // }   
    const genre = await Genre.findById(req.params.id);
    //const genre = genres.find(c => (c.id === parseInt(req.params.id) ));  

    if (!genre) return res.status(404).send('Genre not found.');
    res.send(genre);
});

//Create a single genre
router.post('/',  async (req, res) => {
// router.post('/', auth, async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //let genre = await Genre.create({name: req.body.name}); //alternative way
    const genre = new Genre({ name: req.body.name });
    await genre.save();

    //This code was change to only return the genre variable for testing purposes
    //res.send(`Movie Genre created correctly: ${genre}.`);
    res.send(genre);

    // const genre = {
    //     id: genres.length + 1,
    //     name: req.body.name
    // };

    // genres.push(genre);
    // res.send(`Movie Genre created correctly: ${genre.name}.`);
});

//Modify a genre
router.put('/:id', [auth, validateObjectId], async (req, res) => {

    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name
        }
    }, { new: true });

    //const genre = genres.find(c => (c.id === parseInt(req.params.id) ));  
    if (!genre) return res.status(404).send('Genre not found.');

    // const { error } = validateGenre(req.body);    
    // if (error) return res.status(400).send(error.details[0].message);  
    //genre.name = req.body.name;

    //This code was change to only return the genre variable for testing purposes
    //res.send(`Movie Genre updated correctly: ${genre}.`);
    res.send(genre);

});

//Delete a genre
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {

    const genre = await Genre.findByIdAndDelete(req.params.id);

    //const genre = genres.find(c => (c.id === parseInt(req.params.id) ));  
    if (!genre) return res.status(404).send('Genre not found.');

    // const index = genres.indexOf(genre);
    // genres.splice(index, 1);

    //This code was change to only return the genre variable for testing purposes
    //res.send(`Movie Genre deleted correctly: ${genre.name}.`);
    res.send(genre);

});

module.exports = router;