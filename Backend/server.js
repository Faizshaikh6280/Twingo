import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at: 💥", promise, "reason:", reason);
  process.exit(1); // Exit with a failure code
});
import authRouter from "../Backend/routes/authRoutes.js";
import userRouter from "../Backend/routes/userRoutes.js";
import connectToMongoDB from "./DB/connectToMongoDB.js";
import globalErrorHandler from "../Backend/controllers/errorController.js";

dotenv.config({ path: "./.env" });
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.use("*", (req, res, next) => {
  res.send(`Cannot find ${req.originalUrl} on this url`);
});
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectToMongoDB();
});

process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error 💥", err);
  process.exit(1); // Exit with a failure code
});
