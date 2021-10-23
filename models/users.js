const mongoose = require('mongoose');
const bookSchema = require('./book');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    address: String,
    password: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;