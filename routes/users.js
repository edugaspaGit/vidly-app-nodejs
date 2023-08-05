
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validateUser } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

//Get all users
router.get('/', async (req, res) => {
    const users = await User.find().sort('name');
    res.send(users);
});

//Get a single user
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).send('User not found.');
    res.send(user);
});

//Create a single user
router.post('/', auth, async (req, res) => {

    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    user = new User(
        _.pick(req.body, ['name', 'email', 'password'])
        // name: req.body.name, 
        // email: req.body.email, 
        // password: req.body.password 
    );
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    const token = user.generateAuthToken();

    //const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey') );
    res.header('x-auth-token', token).send(_.pick(user, ['name', 'email']));
    //res.send( _.pick( user, ['name', 'email'] ) );    

    //    res.send(`User created correctly: ${user.name, user.email}.`);

});

module.exports = router;