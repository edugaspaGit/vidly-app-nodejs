
const auth = require('../middleware/auth');
const {Customer, validateCustomer} = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

//Get all customers
router.get('/', async (req, res)=> {    
    const customers =  await Customer.find().sort('name');
    res.send(customers);
});

//Get a single customer
router.get('/:id', async (req, res)=> {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send('Customer not found.');
    res.send(customer);
});

//Create a single customer
router.post('/', auth, async (req, res)=> {    

    const { error } = validateCustomer(req.body);    
    if (error) return res.status(400).send(error.details[0].message);    
    
    const customer = await Customer.create({name: req.body.name, isGold: req.body.isGold, phone: req.body.phone }); //alternative way
    await customer.save();    
    res.send(`Customer created correctly: ${customer}.`);

});


//Modify a customer
router.put('/:id', async (req, res)=> {
    
    const { error } = validateCustomer(req.body);    
    if (error) return res.status(400).send(error.details[0].message);  

    const customer = await Customer.findByIdAndUpdate( req.params.id, { $set: {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
        }}, { new: true } );
        
    if (!customer) return res.status(404).send('Customer not found.');  
    
    res.send(`Customer updated correctly: ${customer}.`);

});

//Delete a customer
router.delete('/:id', async (req, res)=> {
    
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) return res.status(404).send('Customer not found.');           


    res.send(`Customer deleted correctly: ${customer.name}.`);   

});


module.exports = router;