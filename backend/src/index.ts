import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { env } from "./constants/env";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";

dotenv.config();

const app = express();
const PORT = env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

mongoose
  .connect(env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
