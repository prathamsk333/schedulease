import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { Request } from "express";

export interface IUser extends mongoose.Document {
  id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  passwordConfirm?: string;
  phone: string;
  token?: string;
  active: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createPasswordResetToken(): string;
}

interface IUserModel extends mongoose.Model<IUser> {
  passwordCorrect(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el: string) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  phone: {
    type: String,
    required: [true, "Please provide your phone number"],
  },
  token: String,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password!, 12);
  this.passwordConfirm = undefined;
});
    
userSchema.methods.createPasswordResetToken = function () {   
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; 
  return resetToken;
};

userSchema.statics.passwordCorrect = async function (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User: IUserModel = mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;