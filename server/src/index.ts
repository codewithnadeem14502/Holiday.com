import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieparser from "cookie-parser";
const MONGODB_URL = process.env.MONGODB_URL as string;
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGODB_URL);

const app = express();
app.use(cookieparser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEN_URL,
    credentials: true,
  })
);

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
