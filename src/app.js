const express = require("express");
const connectDb = require("./Config/database");
const User = require("./model/user");
const app = express();

// Creating API's
app.post("/signup", async (req, res) => {
  // Creating a new instance of the user model
  const user = new User({
    firstName: "Dhoni",
    lastName: "MS",
    emailId: "ms.dhoni@gmail.com",
    password: "MsDhoni@123",
  });
  try {
    await user.save();
    res.send("User added successfully!");
  } catch (err) {
    res.status(400).send("Error saving the user", err.message);
  }
});

connectDb()
  .then(() => {
    console.log("Database connection successful...");
    app.listen(9999, () => {
      console.log("Your express app is running in the portal:9999");
    });
  })
  .catch((err) =>
    console.log("Ooops! Error occured while connecting to the database...", err)
  );
