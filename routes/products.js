var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product.js'); 



router.get('/', async (req, res, next) => {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }
    try {
        const products = await Product.find().populate('haveStore') ; 
        res.writeHead(200,headers);
        res.write(JSON.stringify({
            "status":"success",
            products
        }))
        res.end(); 
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;