var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Seller = require('../models/seller.js');
const Order = require('../models/order.js');

//商家導覽
router.get('/:seller_id/home', async(req, res, next)=> {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  }
  try{
    const seller = req.params.seller_id;
    const thisShop = await Seller.findOne({_id:seller})
    res.writeHead(200,headers);
    res.write(JSON.stringify({
        "status":"success",
        thisShop
    }))
    res.end()
  }catch(err){
    res.writeHead(500, headers); 
    res.end(JSON.stringify({
        "status": "error",
        "message": "Internal Server Error"
    }));
  }
});
//商家資訊
router.get('/:seller_id/information', async(req, res, next)=> {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  }
  try{
    const seller = req.params.seller_id;
    const thisShop = await Seller.findOne({_id:seller})
    res.writeHead(200,headers);
    res.write(JSON.stringify({
        "status":"success" ,
        thisShop
    }))
    res.end()
  }catch(err){
    res.writeHead(500, headers); 
    res.end(JSON.stringify({
        "status": "error",
        "message": "Internal Server Error"
    }));
  }
});
//訂單管理
router.get('/:seller_id/orders', async(req, res, next)=> {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  }
  try{
    const seller = req.params.seller_id;
    const thisShop = await Seller.find({_id:seller}).populate('order').select({ order: 1, _id: 0 });
    res.writeHead(200,headers);
    res.write(JSON.stringify({
        "status":"success",
        thisShop
    }))
    res.end()
  }catch(err){
    res.writeHead(500, headers); 
    res.end(JSON.stringify({
        "status": "error",
        "message": "Internal Server Error"
    }));
  }
});


module.exports = router;