var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ordersSchema = new Schema({
    name: String,
})
const order = mongoose.model('Orders',ordersSchema);

router.get('/', async(req, res, next)=> {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE,PUT',
        'Content-Type': 'application/json'
    }
    try {
        const orders = await order.find();
        res.writeHead(200,headers);
        res.write(JSON.stringify({
            "status":"success",
            orders
        }))
        res.end()
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
module.exports = router;