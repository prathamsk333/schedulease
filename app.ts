import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import mongoose from "mongoose";
import userRouter from "./routes/userRoute";
import appointRouter from './routes/appointRoute';

dotenv.config({ path: "./config.env" });
const app = express();

app.use(express.json());
//-------------------------DB connection-----------------------------------------//
console.log(process.env.DATABASE);
const DB =
  process.env.DATABASE?.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD || ""
  ) || "";
mongoose.connect(DB, {}).then((connection: any) => {
  console.log("DB connection successfull");
});

dotenv.config({ path: "./config.env" });

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/appointments", appointRouter)

export default app;
