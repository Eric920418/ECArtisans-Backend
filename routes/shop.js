var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Seller = require('../models/seller.js');

//商家導覽
router.get('/:sellerId/guide', async(req, res, next)=> {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  }
  try{
    const seller = req.params.sellerId;
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
router.get('/:sellerId/information', async(req, res, next)=> {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  }
  try{
    const seller = req.params.sellerId;
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
//訂單管理
router.get('/:sellerId/orders', async(req, res, next)=> {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  }
  try{
    const seller = req.params.sellerId;
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
//單一訂單管理
router.get('/:sellerId/order/:orderId', async(req, res, next)=> {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  }
  try{
    const seller = req.params.sellerId;
    const order = req.params.orderId;
    const thisShop = await Seller.findOne({_id:seller},{order:order})
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