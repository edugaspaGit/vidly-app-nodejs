
const auth = require('../middleware/auth');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const { Rental, validateRental } = require('../models/rental');
const mongoose = require('mongoose');
const express = require('express');
const Fawn = require('fawn');
const router = express.Router();

Fawn.init('mongodb://localhost/vidly-db');

//Get all Rentals
router.get('/', async (req, res) => {
    //const rentals =  await Rental.find();
    const rentals = await Rental.find().sort('customer.name');
    res.send(rentals);
});

//Get a single Rental
router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).send('Rental not found.');
    res.send(rental);
});

//Create a single Rental
router.post('/', auth, async (req, res) => {

    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(404).send('Customer not found.');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(404).send('Movie not found.');

    if (movie.numberInStock === 0) return res.status(404).send('Insufficient Stock.');

    const rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            //genre: movie.genre,            
            dailyRentalRate: movie.dailyRentalRate
        }

    });

    await rental.save();    
    movie.numberInStock--;
    movie.save();
    res.send(`Rental created correctly: ${rental}.`);

    // const MongoClient = require('mongodb').MongoClient;

    // // Connection URL
    // const url = 'mongodb://localhost:27017';

    // // Database Name
    // const dbName = 'vidly-db';

    // // Create a new MongoClient
    // const client = new MongoClient(url);

    // // Use connect method to connect to the Server
    // client.connect(function (err) {
    //     if (err) throw err;
    //     console.log("Connected successfully to server");

    //     const db = client.db(dbName);
    //     const session = client.startSession();
    //     session.startTransaction();
    //     try {
    //         // Update the user's balance
    //         const rentals = db.collection('rentals');
    //         rentals.insertOne(rental);

    //         // Update the product's quantity
    //         const movies = db.collection('movies');
    //         products.updateOne({ _id: movie._id }, { $inc: { numberInStock: -1 } }, { session });

    //         // Commit the transaction
    //         session.commitTransaction();
    //         console.log("Transaction succeeded!");
    //     } catch (error) {
    //         console.log("Transaction failed: " + error);
    //         session.abortTransaction();
    //     } finally {
    //         client.close();
    //     }
    // });


    // try {
    //     new Fawn.Task()
    //         .save('rentals', rental)
    //         .update('movies', { _id: movie._id }, {
    //             $inc: { numberInStock: -1 }
    //         })
    //         .run();
    //     res.send(`Rental created correctly: ${rental}.`);

    // } catch (ex) {
    //     res.status(500).send('DB couldnt be updated');
    // }

});

//Modify a rental
// router.put('/:id', async (req, res)=> {

//     const { error } = validateMovie(req.body);    
//     if (error) return res.status(400).send(error.details[0].message);  

//     const genre = await Genre.findById(req.body.genreId);
//     if (!genre) return res.status(404).send('Genre not found.');

//     const movie = await Movie.findByIdAndUpdate( req.params.id, { $set: {
//         title: req.body.title,
//         genre: {
//             _id: genre._id,
//             name: genre.name
//         },
//         numberInStock: req.body.numberInStock,
//         dailyRentalRate: req.body.dailyRentalRate
//         }}, { new: true } );

//     if (!movie) return res.status(404).send('Movie not found.');  

//     res.send(`Movie updated correctly: ${movie}.`);

// });

//Delete a rental
router.delete('/:id', async (req, res) => {

    const rental = await Rental.findById(req.params.id);
    //const rental = await Rental.findByIdAndDelete(req.params.id);

    if (!rental) return res.status(404).send('Rental not found.');

    const movie = await Movie.findById(rental.movie._id);
    movie.numberInStock++;
    movie.save();

    rental.delete();
    rental.save();

    res.send(`Rental deleted correctly: ${rental}.`);

});

module.exports = router;