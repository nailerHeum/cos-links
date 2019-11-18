const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nickname: String,
  githubid: String,
  posts: Array,
});

const User = mongoose.model('User', userSchema);

module.exports = User;