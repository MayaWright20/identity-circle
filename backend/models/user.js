import mongoose from "mongoose";
import validator from "validator";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  username: {
    type: String,
    unique: [true, "Username taken"],
    required: [true, "Please choose a username"],
  },
  email: {
    type: String,
    unique: [true, "Email already registed"],
    required: [true, "Please enter your email"],
    validator: [validator.isEmail, "Invalid credentials"],
  },
  password: {
    type: String,
    required: [true, "Invalid credentials"],
    validator: [
      validator.isStrongPassword,
      "Too easy! Please enter a stronger password",
    ],
    select: false,
  },
});

schema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

schema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

schema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "90d",
  });
};

export const User = mongoose.model("User", schema);
