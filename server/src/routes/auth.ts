import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";

const router = express.Router();
// router name,following checks with types and async function
router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    // if any of above check fails then we are going to send the whole arry of error message
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // find user
      const user = await User.findOne({ email });
      // data is wrong
      if (!user) {
        return res.status(404).json({ message: "Invalid Credentials" });
      }
      //  compare password to stored password
      const isMatch = await bcrypt.compare(password, user.password);
      // not match
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }
      //  JWT token is created via by sign -> (userid,secret,expries time )
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1d" }
      );
      // send cookies with name,token and along with condition and maxage
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true in Render
        sameSite: "none", // required for cross-site cookies
        maxAge: 86400000,
      });

      res.status(200).json({ userId: user._id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
});

router.post("/logout", (req: Request, res: Response) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
  });
  res.send();
});
export default router;
