process.env["NODE_CONFIG_DIR"] = __dirname + "/../config";
const config = require("config");
const v1Router = require("./routes/v1");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const db = require("./models/db");
const express = require("express");
const path = require("path");
const app = express();

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});
db();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/v1", v1Router);
app.get("/", (req, res) => res.status(200).render(index.html));

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "linksquad-api",
      version: "1.0.0"
    }
  },
  apis: ["./swagger-docs.yaml"]
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.get("/api-docs.json", function (req, res) {
  // line 41
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const listen = app.listen(config.get('port'), () =>
  console.log(`Run server on port ${config.get('port')}`)
);
module.exports = app;
module.exports.port = listen.address().port;