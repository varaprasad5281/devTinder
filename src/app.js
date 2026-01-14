const express = require("express");
const connectDb = require("./Config/database");
const User = require("./model/user");
const validations = require("./utils/Validation");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json()); // Converts the JSON into the Object (Middleware )

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
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.send("User login Successfull!!!!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error" + err.message);
  }
});

//How to find one user from the databse

app.get("/user", async (req, res) => {
  const userId = req.body.id;
  try {
    const user = await User.findById({ _id: userId });
    if (!user) {
      res.send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("something went wrong" + err.message);
  }
});

// Delete API  Data from the databse

app.delete("/user", async (req, res) => {
  const userId = await req.body.id;
  try {
    const deleteData = await User.findByIdAndDelete({ _id: userId });
    if (!deleteData) {
      res.send("Oops please try again to delete it");
    }
    res.send("User successfully deleted!");
  } catch (err) {
    res.send("Unable to deleted the user..Please try again" + err.message);
  }
});

// How to updated the user in the data base - UPDATE API

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  const RESTRICTED_FIELDS = ["photoUrl", "about", "gender", "skills"];

  const allowedFields = Object.keys(data).every((field) =>
    RESTRICTED_FIELDS.includes(field)
  );
  if (!allowedFields) {
    throw new Error("Update not allowed");
  }
  try {
    const updateFirstName = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    res.send("User udpated successfully!");
  } catch (err) {
    res.send("Unable to updated the request" + err.message);
  }
});

// Get all the User data from the databse
app.get("/user", async (req, res) => {
  const firstUserMail = req.body.emailId;
  try {
    const output = await User.findOne({ emailId: firstUserMail });
    res.send(output);
  } catch (err) {
    res
      .status(400)
      .send(
        "Error occuered while get the data form the database" + err.message
      );
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
    console.log(
      "Ooops! Error occured while connecting to the database..." + err.message
    )
  );
