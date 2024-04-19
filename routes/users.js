var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user.js');

// Get 全部買家
router.get('/', async(req, res, next)=> {
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
    res.end();
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});

// Get 單一買家
router.get('/:id', async(req, res, next)=> {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, PUT, POST, GET, OPTIONS, DELETE',
    'Content-Type': 'application/json'
  }
  try {
    const user = req.params.id;
    const data = await User.findOne({_id:user});
    res.writeHead(200,headers);
    res.write(JSON.stringify({
        "status":"success",
        "message": "成功取得資料",
        data
    }))
    res.end();
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});


// PUT 編輯單一會員資料(買家)
router.put('/:id', async(req, res, next)=> {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, PUT, POST, GET, OPTIONS, DELETE',
    'Content-Type': 'application/json'
  }
  try {
    const user = req.params.id;
    const data = await User.updateOne({_id:user},req.body);
    res.writeHead(200,headers);
    res.write(JSON.stringify({
        "status":"success",
        "message": "成功修改資料",
        data
    }))
    res.end();
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});
module.exports = router;
