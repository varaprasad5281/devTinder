const jwt = require("jsonwebtoken");
const User = require("../model/user");

const userAuth = async (req, res, next) => {
  try {
    // Read the token form the req cookies
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not valid!");
    }
    // Validate the token
    const decodedObj = await jwt.verify(token, "Dev@Tinder$287");
    const { _id } = decodedObj;
    // Find the user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User Not Found");
    }
    req.user = user;
    // To move the the request handler
    next();
  } catch (err) {
    res.status(400).send("Bad request! " + err.message);
  }
};
module.exports = { userAuth };
