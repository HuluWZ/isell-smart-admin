const mongoose = require("mongoose");
const { USER_TYPES,PAYMENT_METHODS } = require("../config/utils");

const UserSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: [true, "Full Name is required"],
    },
    phoneNumber: {
      type: String,
      trim: true,
      unique: [true, "Phone Number is Unique"],
      required: [true, "Phone Number is required"],
    },
    address:{
      type: String,
      trim: true,
    },
    city: {
      type: String, 
      trim: true,
    },
    email: {
      type: String,
      unique: [true, "Email is Unique"],
      required: [true, "Email is Required"],
    },
    plainPassword: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ['ADMIN', 'USER'],
      default: "USER",
    }
  },
  { timestamps: true }
);

const User =  mongoose.model("User", UserSchema, "User");
module.exports = { User };