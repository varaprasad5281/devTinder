const { default: mongoose } = require("mongoose");
var validator = require("validator");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: (val) => {
        if (!validator.isEmail(val)) {
          throw new Error("Email address format is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate: (val) => {
        if (!validator.isStrongPassword(val)) {
          throw new Error("Password should be strong");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      validate: (val) => {
        if (val < 18) {
          throw new Error("User must be above 18 Years of age");
        }
      },
    },
    gender: {
      type: String,
      validate: (val) => {
        if (!["Male", "Female", "Others"].includes(val)) {
          throw new Error("Gender is Invalid!");
        }
      },
    },
    about: {
      type: String,
      default: "This is my about ",
    },
    photoUrl: {
      type: String,
      validate: (val) => {
        if (!validator.isURL(val)) {
          throw new Error("URL format is invalid");
        }
      },
    },
    skills: {
      type: [String],
      validate: (val) => {
        if (val.length > 10) {
          throw new Error("Max 10 skills are allowed");
        }
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
