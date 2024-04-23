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
    'Access-Control-Allow-Methods': 'PATCH, PUT, POST, GET, OPTIONS, DELETE,PUT',
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
        const updateData = {
            name: req.body.name,
            gender: req.body.gender,
            avatar: req.body.avatar,
            birthday: req.body.birthday,
            phone: req.body.phone,
            mail: req.body.mail,
            address: req.body.address,
            password: req.body.password,
            otherPassword: req.body.otherPassword,
        };

        const updatedUser = await User.findByIdAndUpdate(user, { $set: updateData }, { new: true });

        res.status(200).json({
            status: "success",
            message: "成功修改資料",
            data: updatedUser
        });

        res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      "status":"fail",
      "message": "無法更新個人資料，請檢查所提供的資訊。"
    });
  }
});
module.exports = router;
