const express = require("express");
const connectDb = require("./Config/database");
const app = express();

connectDb()
  .then(() => {
    console.log("Database connection successful...");
    app.listen("9999", () => {
      console.log("Your express app is running in the portal:9999");
    });
  })
  .catch((err) =>
    console.log("Ooops! Error occured while connecting to the database...", err)
  );
