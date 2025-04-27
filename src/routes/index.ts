import { Router } from "express";
import authRoute from "./authRoutes";
// import orderRoute from "./orderRoutes";
import uploadRoute from "./uploadRoutes";
import orderRoute from "./orderRoutes";
const router: Router = Router();

router.use("/auth", authRoute);
router.use("/upload", uploadRoute);
router.use("/order", orderRoute);

router.get("/", (req, res) => {
  res.send("hello world");
});

export default router; 