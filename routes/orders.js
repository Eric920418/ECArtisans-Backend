var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order.js')

//單一訂單管理
router.get('/:order_id', async(req, res, next)=> {
    const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length,    X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
    }
    try{
        const order = req.params.order_id;
        const thisShop = await Order.findOne({_id:order}).populate('products')
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