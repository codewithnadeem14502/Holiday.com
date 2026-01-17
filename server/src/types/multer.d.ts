import multer from "multer";

declare global {
    namespace Express {
        type Multer = multer.Multer;
        type File = multer.File;
    }
}
