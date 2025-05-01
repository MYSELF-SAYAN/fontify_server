import { Request, Response, NextFunction } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import User from "../models/User";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already registered" });
      return;
    }

    // Hash password with argon2
    const hashedPassword = await argon2.hash(password);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User created successfully" });
    return;
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error", error: error });
    return;
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // Verify password using argon2
    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );
    const role= user.role;
    const userId= user._id; // Get the user's role
    // Send token and user role in response

    res.status(200).json({ token, role, userId });
    return;
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};
