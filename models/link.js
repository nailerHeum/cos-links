const config = require('config');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

(async () => {
  try{
  await mongoose.connect(`mongodb://${process.env.DB_HOST || 'localhost'}:27017/${process.env.DB}`,
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
