
const {genreSchema} = require('../models/genre');
const mongoose = require('mongoose');
const Joi = require('joi');
//Joi.objectId = require('joi-objectid')(Joi);
const { type } = require('joi/lib/types/object');

const Rental = mongoose.model('Rental', new mongoose.Schema({       
    customer: {
        type: new mongoose.Schema({            
            name: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 50
            },
            isGold: {
                type: Boolean,
                required: true
            },            
            phone: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 50
            }  
        }),
        required: true
    },
    
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlenght: 5,
                maxlenght: 50
            },
            // genre: {
            //     type: genreSchema,    
            //     required: true
            // },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true    
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
}));

 function validateRental(rental) {
     const schema = {         
         customerId: Joi.objectId().required(),
         movieId: Joi.objectId().required()         
     };
     return Joi.validate(rental, schema);
 }

module.exports.Rental = Rental;
module.exports.validateRental = validateRental;