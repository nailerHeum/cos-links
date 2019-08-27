const config = require('config');
const express = require('express');
const v1Router = require('./routes/v1');
var bodyParser = require('body-parser');
const app = express();

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('dist'));
app.use('/v1', v1Router);
app.get('/', (req, res) => res.status(200).render(index.html));

const listen = app.listen(config.get('port'), () => console.log(`Testing server on port ${config.get('port')}`));

module.exports = app;
module.exports.port = listen.address().port;
