const dotenv = require("dotenv").config({ path: "../config/.env" });
const mongoose = require("mongoose");
const DB_HOST = process.env.DB_HOST ? process.env.DB_HOST : "localhost";
const DB = process.env.DB;

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

module.exports = async () => {
  try {
    await mongoose.connect(`mongodb://${DB_HOST}:27017/${DB}`, {
      useNewUrlParser: true
    });
  } catch (err) {
    console.log(err);
  }

  const db = mongoose.connection;

  db.on("error", async err => {
    console.log(err);
    await sleep(5000);
    console.log("Trying again...");
    await mongoose.connect(`mongodb://${DB_HOST}:27017/${DB}`, {
      useNewUrlParser: true
    });
  });

  db.once("open", async () => {
    console.log("DB Connected");
    require("./link");
  });
};
