import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import { Readable } from "stream";
export const uploadFont = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).send("No font file uploaded");
        return;
      }
      console.log("File:", req.file); 
  
    
      const bufferStream = new Readable();
      bufferStream.push(req.file.buffer); 
      bufferStream.push(null);  
  
     
      const result = await cloudinary.uploader.upload_stream(
        {
          resource_type: "raw", 
          public_id: `fonts/${req.file.originalname}`,
        },
        (error, result) => {
          if (error) {
            return res.status(500).send(error.message);
          }
          res.status(200).json({ url: result?.secure_url }); 
        }
      );
  
      bufferStream.pipe(result);
    } catch (error) {
      console.error("Upload Font Error:", error);
      res.status(500).send("Error uploading font");
    }
  };
export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).send("No image file uploaded");
      return;
    }
    console.log("File:", req.file); 

    
    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer); 
    bufferStream.push(null); 


    const result = await cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        public_id: `images/${req.file.originalname}`,
      },
      (error, result) => {
        if (error) {
          return res.status(500).send(error);
        }
        res.status(200).json({ url: result?.secure_url });
      }
    );

    // Pipe the image buffer stream to Cloudinary
    bufferStream.pipe(result);
  } catch (error) {
    console.error("Upload Image Error:", error);
    res.status(500).send("Error uploading image");
  }
};
