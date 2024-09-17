import app from "./app";

const port: number = 5000;

const server = app.listen(port, () => {
  console.log(`server is running in the port ${port}`);
});
