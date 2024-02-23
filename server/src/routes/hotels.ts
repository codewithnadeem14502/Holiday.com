import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import { HotelSearchResponse } from "../shared/types";
const router = express.Router();

router.get("/search", async (req: Request, res: Response) => {
  try {
    // paginations
    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );

    const skip = (pageNumber - 1) * pageSize;
    // skip ex: pagnumber = 3 -> (3 - 1) * 5 = > 10
    // display all hotels
    const hotels = await Hotel.find().skip(skip).limit(pageSize);

    const total = await Hotel.countDocuments();

    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };
    res.json(response);
  } catch (error) {
    console.log("error : ", error);
    res.status(401).json({ message: "Something went wrong" });
  }
});

export default router;
