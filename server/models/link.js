const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const linkSchema = new mongoose.Schema({
  author: String,
  title: String,
  description: String,
  category: String,
  url: String,
  metadata: String,
});

linkSchema.plugin(mongoosePaginate);
const Link = mongoose.model('Link', linkSchema);

module.exports = Link;