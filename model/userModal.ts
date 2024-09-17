import mongoose from "mongoose";

import validator from "validator";

import bcrypt from "bcryptjs";

import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

// const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
    minlength: [3, "Name must be at least 3 characters long"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "please provide your email address"],
    unique: true,
    validate: [validator.isEmail, "please provide a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password!"],
    minlength: 8,
    select: false,
  },
  phone: {
    type: String,
    required: [true, "Please provide your phone number"],
    unique: true,
  },
  token: String,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre(/^find/, function (this: any, next: () => void) {
  this.find({ active: true });
  next();
});

interface IUser extends mongoose.Document {
  id: Number;
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  phone: string;
  token?: string;
  active: boolean;
}

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.statics.passwordCorrect = async function (
  candidatePassword: string,

  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

interface IUserModel extends mongoose.Model<IUser> {
  passwordCorrect(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
}

const User: IUserModel = mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;
