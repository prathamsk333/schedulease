import app from "./app";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

const server = app.listen(port, () => {
  console.log(`server is running in the port ${port}`);
});
