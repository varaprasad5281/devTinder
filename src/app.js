const express = require("express");
const connectDb = require("./Config/database");
const app = express();
const User = require("./model/user");
const validations = require("./utils/Validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json()); // Converts the JSON into the Object (Middleware )
app.use(cookieParser()); // Reading the cookie
// Creating API's
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    // Validation of data
    validations(req);
    // Encrypt the passwords

    const passwordHash = await bcrypt.hash(password, 10);
    // Creating a new instance of the user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save({ runValidators: true });
    res.send("User added successfully!");
  } catch (err) {
    res.status(400).send("Error saving the user " + err.message);
  }
});

// Login API
app.post("/signin", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.status(404).send("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      //Create a JWT Token (hide some data and show some privatekey over hidden data)
      const token = await user.getJWT();
      // Add Token to Cookie and send response back to user
      res.cookie(
        "token",
        token,
        { expires: new Date(Date.now() + 8 * 3600000) },
        { httpOnly: true }
      );
      res.send("User login Successfull!!!!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error" + err.message);
  }
});

// Profile API
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

// Send connection Request
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;

  console.log("Sending Connection request");
  res.send(user.firstName + " Sent the connection request");
});

connectDb()
  .then(() => {
    console.log("Database connection successful...");
    app.listen(9999, () => {
      console.log("Your express app is running in the portal:9999");
    });
  })
  .catch((err) =>
    console.log(
      "Ooops! Error occured while connecting to the database..." + err.message
    )
  );
