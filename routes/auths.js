
const bcrypt = require('bcrypt');
const Joi = require('joi');
const _ = require('lodash');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

//Logg with the User name and password
router.post('/', async (req, res)=> {    

    const { error } = validate(req.body);    
    if (error) return res.status(400).send(error.details[0].message);          
    
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid user or password.');

    const validPassword = await bcrypt.compare( req.body.password, user.password );
    if (!validPassword) return res.status(400).send('Invalid user or password.');
        
    const token = user.generateAuthToken();
    //const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey') );
    res.send(token);    

});

function validate(req) {
    const schema = {
        email: Joi.string().min(7).max(100).email().required(),
        password: Joi.string().min(5).max(100).required()
    };
    return Joi.validate(req, schema);
}

module.exports = router;