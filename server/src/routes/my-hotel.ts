import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
const router = express.Router();

// config multer
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB
  },
});
//api/add-hotels
router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required"),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      //1) updload image to cloudinary

      const imagesUrls = await uploadImages(imageFiles);
      newHotel.imageUrls = imagesUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      //3) save new hotel in our database
      const hotel = new Hotel(newHotel);
      await hotel.save();
      // 4) return a 201 status created successfully
      res.status(201).send(hotel);
    } catch (error) {
      console.log("error createing hotel: ", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);
//api/get-hotels
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Error fetching Hotels" });
  }
});
//  api/get (edit)
router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  // id getting here
  const id = req.params.id.toString();

  try {
    const hotel = await Hotel.findOne({ _id: id, userId: req.userId });
    res.json(hotel);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching details" });
  }
});

router.put(
  "/:hotelId",
  verifyToken,
  upload.array("imageFiles"),
  async (req: Request, res: Response) => {
    try {
      const updatedHotel: HotelType = req.body;
      updatedHotel.lastUpdated = new Date();

      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: req.params.hotelId,
          userId: req.userId,
        },
        updatedHotel,
        { new: true }
      );
      if (!hotel) {
        return res.status(404).json({ message: "No Hotel found" });
      }
      const files = req.files as Express.Multer.File[];
      const updatedImageUrls = await uploadImages(files);

      hotel.imageUrls = [
        ...updatedImageUrls,
        ...(updatedHotel.imageUrls || []),
      ];

      await hotel.save();

      res.status(201).json(hotel);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);
async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    // loop for each image
    // en-codeing base 64
    const b64 = Buffer.from(image.buffer).toString("base64");

    // desc  the image
    let dataURL = "data:" + image.mimetype + ";base64," + b64;

    // uploading
    const res = await cloudinary.v2.uploader.upload(dataURL);

    // getting url of the image
    return res.url;
  });
  //2) if upload success, add urls to the new hotel
  // getting to all promises
  const imagesUrls = await Promise.all(uploadPromises);
  return imagesUrls;
}

export default router;
