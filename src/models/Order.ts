import mongoose, { Document, Schema } from "mongoose";

interface Order extends Document {
  userId: mongoose.Types.ObjectId;
  imageUrl: string;
  fontFileUrl?: string;
  status: "started" | "added" | "pending" | "done" | "cancel";
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      // ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    fontFileUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["started", "added", "pending", "done", "cancel"],
      default: "started",
    },
  },
  { timestamps: true }
);

export default mongoose.model<Order>("Order", orderSchema);
