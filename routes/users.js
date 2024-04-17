var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user.js');

router.get('/user', async(req, res, next)=> {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  }
  try {
    const users = await User.find();
    res.writeHead(200,headers);
    res.write(JSON.stringify({
        "status":"success",
        users
    }))
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
