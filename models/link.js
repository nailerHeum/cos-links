const config = require('config');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const DB_HOST = process.env.DB_HOST ? process.env.DB_HOST : 'localhost'
const DB = process.env.DB ? process.env.DB : config.get('DB');

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

(async () => {
  try {
    await mongoose.connect(`mongodb://${DB_HOST}:27017/${DB}`, {
      useNewUrlParser: true
    });
  } catch (err) {
    console.log(err);
  }

  const db = mongoose.connection;

  db.on('error', async err => {
    console.log(err);
    await sleep(5000);
    console.log('Trying again...');
    await mongoose.connect(`mongodb://${DB_HOST}:27017/${DB}`, {
      useNewUrlParser: true
    });
  });

  db.once('open', async () => {
    console.log('DB Connected');
  });
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