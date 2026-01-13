const { default: mongoose } = require("mongoose");

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
    },
    password: { type: String, required: true },
    age: { type: Number, min: 18 },
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
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
