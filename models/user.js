
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('joi');
const boolean = require('joi/lib/types/boolean');

const userSchema = new mongoose.Schema({    
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 7,
        maxlength: 100
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    isAdmin: Boolean    
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey') );
    return token;
}

const User = mongoose.model( 'User', userSchema );

function validateUser(user) {
    const schema = {
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().min(7).max(100).email().required(),
        password: Joi.string().min(5).max(100).required()
    };
    return Joi.validate(user, schema);

}

module.exports.User = User;
module.exports.validateUser = validateUser;