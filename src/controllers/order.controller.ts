import { Request, Response } from "express";
import Order from "../models/Order"; // Import the order model
import User from "../models/User"; // If you need to fetch user info
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file
const sendNotificationEmail = (userEmail: string, fontFileUrl: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL, // Use environment variable for email
      pass: process.env.USER_EMAIL_PASSWORD, // Use environment variable for password
    },

    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.USER_EMAIL, // Use environment variable for email
    to: userEmail,
    subject: "Font File Ready for Download",
    text: `Your font file is ready. Download it here: ${fontFileUrl}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email: ", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId, imageUrl } = req.body;
    const newOrder = new Order({
      userId,
      imageUrl,
      status: "pending",
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order: ", error);
    res.status(500).send("Error creating order");
  }
};

export const getOrdersForUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    // console.log("User ID: ", userId); // Debugging line to check userId
    const orders = await Order.find({ userId: userId }); // Populate userId with email and name

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders: ", error);
    res.status(500).send("Error fetching orders");
  }
};

export const getAllOrdersForAdmin = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({});

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders: ", error);
    res.status(500).send("Error fetching orders");
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId, status, fontFileUrl } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        status,
        fontFileUrl: status === "done" ? fontFileUrl : "", // Only set fontFileUrl if status is "done"
      },
      { new: true }
    );

    // Send email notification to the user if the status is "done"
      if (updatedOrder?.status === "done") {
        const user = await User.findById(updatedOrder.userId);
        if (user) {
          if (user.email && updatedOrder.fontFileUrl) {
            sendNotificationEmail(user.email, updatedOrder.fontFileUrl);
          }
        }
      }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status: ", error);
    res.status(500).send("Error updating order status");
  }
};

export const getOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate(
      "userId",
      "email name"
    );

    if (!order) {
      res.status(404).send("Order not found");
      return; // Make sure to return after sending a response to prevent further execution
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order: ", error);
    res.status(500).send("Error fetching order");
  }
};

export const updateFontUrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.params; // Get orderId from URL params
    const { fontUrl } = req.body; // Get the new fontUrl from the request body

    // Validate the input
    if (!fontUrl) {
      res.status(400).json({ message: "Font URL is required" });
      return;
    }

    // Find the order by orderId and update the fontUrl
    const order = await Order.findByIdAndUpdate(
      orderId,
      { fontFileUrl: fontUrl },
      { new: true } // Return the updated order
    );

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    // Return the updated order object
    res.status(200).json({ message: "Font URL updated successfully", order });
  } catch (error) {
    console.error("Error updating font URL:", error);
    res.status(500).json({ message: "Error updating font URL" });
  }
};
