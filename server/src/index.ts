
import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import myHotelsRoutes from "./routes/my-hotel";
import hotelRoutes from "./routes/hotels";
import bookingRoutes from "./routes/my-bookings";

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

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Cookie parsing middleware
app.use(cookieParser(process.env.COOKIE_SECRET));

// Set sameSite attribute for cookies
app.use((req, res, next) => {
  res.cookie("sameSite", "none", {
    sameSite: "none", // Set sameSite attribute to none for cross-domain cookies
    secure: true, // Ensure cookies are only sent over HTTPS
  });
  next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/my-hotels", myHotelsRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/my-bookings", bookingRoutes);

// Default route
app.get("*", (req: Request, res: Response) => {
  res.send("Holiday backend server is working");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
