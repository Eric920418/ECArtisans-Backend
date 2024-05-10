var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Seller = require('../models/seller.js');

const bcrypt = require('bcrypt'); //加密套件
const jwt = require('jsonwebtoken');


//取得所有賣家
router.get("/", async(req, res, next) => {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  }
  try {
    const sellers = await Seller.find()
    res.writeHead(200, headers)
    res.write(JSON.stringify({
      status: "success",
      sellers
    }))
    res.end()
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status:'error',
      message: "server error"
    })
  }
}) 


module.exports = router;