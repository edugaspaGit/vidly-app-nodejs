
const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({    
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
});

const Customer = mongoose.model( 'Customer', customerSchema );

function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().min(3).max(50).required()
    };
    return Joi.validate(customer, schema);

}

module.exports.Customer = Customer;
module.exports.validateCustomer = validateCustomer;