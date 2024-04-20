var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Seller = require('../models/seller.js')

const bcrypt = require('bcrypt'); //加密套件
const validator = require('validator') //表單驗證
const jwt = require('jsonwebtoken')

//token
const generateSendJWT = (user, statusCode, res)=>{
  const token = jwt.sign({id:user._id ,name:user.bossName},process.env.JWT_SECRET,{
    expiresIn: process.env.JWT_EXPIRES_DAY
  })
  res.status(statusCode).json({
    status: 'success',
    user:{
      token,
      name: user.brand
    }
  })
}

router.post('/shopLogin', async(req, res, next)=> {
  let {
      bossName, 
      gender, 
      phone, 
      mail,
      password,
      confirmPassword, 
      brand, 
      address, 
      collection,
      salesType,
      introduce
    } = req.body
  //不能空的內容
  // if(!mail||!password||!confirmPassword||!gender||!phone||!brand||!bossName){
  //   return 
  // }
  // //確認密碼
  // if(password !=confirmPassword ){
  //   return
  // }
  // if(!validator.isLength(password,{min:8})){
  //   return
  // }
  // if(!validator.isEmail(mail)){
  //   return
  // }

  //加密
  password = await bcrypt.hash(req.body.password,12)
  const newUser = await Seller.create({
    bossName, 
    gender, 
    phone, 
    mail,
    password,
    confirmPassword, 
    brand, 
    address, 
    collection,
    salesType,
    introduce
  })

  generateSendJWT(newUser,201,res)

});

module.exports = router;