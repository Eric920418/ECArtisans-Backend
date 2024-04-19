var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Seller = require('../models/seller.js')


router.get('/', (req, res, next)=> {
  res.render('index', { title: 'Express' });
});

module.exports = router;