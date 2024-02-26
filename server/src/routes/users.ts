import express, { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";

const router = express.Router();
// router name,following checks with types and async function

router.get("/me", verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});
router.post(
  "/register",
  [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check(
      "password",
      "password with more 6 or more character  required"
    ).isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    // if any of above check fails then we are going to send the whole arry of error message
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      // find user
      let user = await User.findOne({
        email: req.body.email,
      });
      // already exists
      if (user) {
        return res.status(400).json({ message: "User already Exists" });
      }
      // or else created new user here
      user = new User(req.body);
      await user.save();
      //  JWT token is created via by sign -> (userid,secret,expries time )
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1d" }
      );
      // send cookies with name,token and along with condition and maxage
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "Production",
        maxAge: 86500000, //1d
      });
      // success
      return res.status(200).send({ message: "User Register OK" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);

export default router;
