const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed passwords
    role: { type: String, enum: ['farmer', 'buyer'], required: true },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
