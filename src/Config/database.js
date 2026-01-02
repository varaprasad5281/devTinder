const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://honeyvara3222_db_user:N4HNGkMn3RorWQcS@cluster0.evlwv2j.mongodb.net/devTinder"
  );
};
module.exports = connectDb;
