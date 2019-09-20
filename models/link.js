const config = require('config');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const DB_HOST = process.env.DB_HOST ? process.env.DB_HOST : 'localhost'
const DB = process.env.DB ? process.env.DB : config.get('DB');
(async () => {
  try{
    if (process.env.DB_HOST === undefined) {

    }
    await mongoose.connect(`mongodb://${DB_HOST}:27017/${DB}`,
      { useNewUrlParser: true }
    );
  } catch (err) {
    console.log(err);
  }
})();
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
