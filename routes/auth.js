var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Seller = require('../models/seller.js')

const bcrypt = require('bcrypt'); //加密套件
const validator = require('validator') //表單驗證
const jwt = require('jsonwebtoken')

const appError = require('../service/appError.js')

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

router.post('/shopSign', async(req, res, next)=> {
  try {
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
      if(!mail||!password||!confirmPassword||!gender||!phone||!brand||!bossName){
        return next(appError(400,"內容不能為空",next))
      }
      //確認密碼
      if(password !=confirmPassword ){
        return next(appError(400,"前後密碼不對",next))
      }
      if(!validator.isLength(password,{min:8})){
        return next(appError(400,"密碼小於8碼",next))
      }
      if(!validator.isEmail(mail)){
        return next(appError(400,"郵件格式錯誤",next))
      }

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
      });

      generateSendJWT(newUser,201,res)
  } catch (error) {
    next(error)
  }
});

router.post('/shopLogin',async(req,res,next)=>{
  try{
      const {mail, password} = req.body
      if(!mail||!password){
        return next(appError(400,'帳號密碼不能為空',next))
      }
      const user = await Seller.findOne({mail}).select('+password')
      const auth = await bcrypt.compare(password,user.password)
      if(!auth){
        return next(appError(400,"密碼不正確",next))
      }
      generateSendJWT(user,200,res)
  }catch(error){
    next(error)
  }
})

module.exports = router;


// {
//   "bossName":"text",
//   "mail":"text@gmail.com",
//   "password":"12345678",
//   "confirmPassword":"12345678",
//   "gender":"男",
//   "phone":"123456789",
//   "brand":"測試一下"
// }