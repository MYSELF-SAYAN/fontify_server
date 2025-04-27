import express from "express";
import { createOrder, getOrdersForUser, getAllOrdersForAdmin, updateOrderStatus, getOrderById,updateFontUrl } from "../controllers/order.controller";
import { authenticateUser,authorizeAdmin } from "../middlewares/authMiddlewares"; // You may have an admin middleware for protection

const router = express.Router();
// Admin routes
router.get("/admin/", authenticateUser, authorizeAdmin, getAllOrdersForAdmin); // Admin fetches all orders
router.post("/", authenticateUser, createOrder); // User creates an order
router.get("/:userId", authenticateUser, getOrdersForUser); // User gets their orders
router.get("/get/:orderId", authenticateUser, getOrderById); // User views a single order
router.put("/admin/status", authenticateUser, authorizeAdmin, updateOrderStatus); // Admin updates order status
router.put('/admin/:orderId/font', authenticateUser, authorizeAdmin, updateFontUrl);
// User routes



export default router;
