import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      enum: ["INFO", "WARN", "ERROR"],
      required: true,
    },
    service: {
      type: String,
      enum: ["auth", "payments", "notifications"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: { type: Date, default: Date.now }
  },
 

);

export default mongoose.model("Log", logSchema);
