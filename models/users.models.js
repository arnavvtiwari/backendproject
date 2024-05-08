const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://arnav:arnav123@cluster0.nnbtmu1.mongodb.net/newtest');

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    email: String,
    password: String,
    age: Number,
    post:[{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }]
});

module.exports = mongoose.model('user', userSchema);