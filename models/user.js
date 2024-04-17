const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({

})

const User = mongoose.model('Users', userSchema);

module.exports = User;  