import multer, { Multer, Field } from "multer";
import { Request } from "express";

const uploadDisk: Multer = multer({
  storage: multer.diskStorage({
    destination: function (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void
    ) {
      cb(null, "./src/uploads/");
    },
    filename: function (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void
    ) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix);
    },
  }),
});

export default uploadDisk;
