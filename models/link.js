const config = require('config');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const DB_HOST = process.env.DB_HOST ? process.env.DB_HOST : 'localhost'
const DB = process.env.DB ? process.env.DB : config.get('DB');

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb://${DB_HOST}:27017/${DB}`, {
      useNewUrlParser: true
    });
  } catch (err) {
    console.log(err);
  }
}

(async () => {
  for (let i = 0; i < 5; i++) {
    try {
      await connectDB();
      break;
    } catch (e) {
      console.log(`${e} TRYING TO CONNECT DB ${i} TIMES`);
    }
  }
  console.log(`Successfully Connected DB`);
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