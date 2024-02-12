import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieparser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import myHotelsRoutes from "./routes/my-hotel";
const PORT = 3000;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
  console.log("Database is connected");
});

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
// static point
app.use(express.static(path.join(__dirname, "../../client/dist")));
// routes end points
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/my-hotels", myHotelsRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
