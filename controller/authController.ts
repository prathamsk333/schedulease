import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

import catchAsync from "../utils/catchAsync";
import User, { IUser } from "../model/userModal";
import mongoose, { Document } from "mongoose";
import Email from "../utils/email";
import { promisify } from "util";

// export interface IUser extends mongoose.Document {
//   id: mongoose.Types.ObjectId;
//   name: string;
//   email: string;
//   password?: string;
//   passwordConfirm?: string;
//   phone: string;
//   token?: string;
//   active: boolean;
// }

const signToken = (id: mongoose.Types.ObjectId): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = async (
  user: IUser,
  statuscode: number,
  res: Response
) => {
  const token = signToken(user.id);

  user.password = undefined;
  user.passwordConfirm = undefined;

  const newUser: IUser | null = await User.findByIdAndUpdate(user.id, {
    token,
  });

  res.status(statuscode).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
};

interface SignupRequest extends Request {
  body: {
    name: string;
    email: string;
    phone: string;
    password: string;
    passwordConfirm: string;
  };
}

export const signup = catchAsync(
  async (
    req: SignupRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    console.log(req.body);
    if (req.body.password !== req.body.passwordConfirm) {
      res.status(400).json({
        status: "fail",
        message: "Passwords do not match",
      });
    }

    const newUser = (await User.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    })) as IUser;

    const url: string = process.env.FROND_URL || "";

    const rest = await new Email(newUser, url).sendWelcome();
    console.log(rest);

    await createSendToken(newUser, 201, res);
  }
);

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Please enter email and password",
    });
  }

  const user: IUser = await User.findOne({ email }).select("password");

  const correct = user.password
    ? await User.passwordCorrect(password, user.password)
    : false;
  console.log(user, correct);
  if (!user || !correct) {
    return res.status(401).json({
      status: "fail",
      message: "please check your credentials",
    });
  }

  await createSendToken(user, 200, res);
});

interface CustomRequest extends Request {
  token?: string;
  user?: IUser;
}

export const protect = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in! please log in",
      });
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const freshUser = await User.findById((decode as jwt.JwtPayload).id);

    if (!freshUser)
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token no longer exists",
      });

    if (req.token && freshUser.token !== req.token) {
      res.status(401).json({
        status: "fail",
        message: "Invalid token",
      });
    }

    req.user = freshUser;

    next();
  }
);

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user: IUser | null = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    const resetToken: string = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    console.log(resetToken);
    const resetURL = `${process.env.FROND_URL}/resetPassword/${resetToken}`;

    try {
      await new Email(user, resetURL).sendPasswordReset();

      res.status(200).json({
        status: "success",
        message: "Token sent to email!",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({
        status: "fail",
        message: "There was an error sending the email. Try again later.",
        err,
      });
    }
  }
);

export const resetPassword = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user: IUser | null = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "Token is invalid or has expired",
    });
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({ validateBeforeSave: false });

  createSendToken(user, 200, res);
});

export const testroute = (req: any, res: Response, next: NextFunction) => {
  res.status(200).json({
    message: "you have successfully entered protected route",
    user: req.user,
  });
};
