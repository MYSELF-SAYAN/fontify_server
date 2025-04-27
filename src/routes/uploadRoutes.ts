import { Router } from "express";
// import { login, signup } from "../controllers/auth.controller";
import { uploadFont, uploadImage } from "../controllers/upload.controller";
import multer from "multer";
// import cloudinary from './cloudinary';
const router: Router = Router();
// Setup multer to handle file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.post("/fonts", upload.single("font"), uploadFont);
router.post("/images", upload.single("image"), uploadImage);

// router.post("/login", login);

export default router;
