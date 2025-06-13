import express from "express";
import cookieParser from "cookie-parser";
import { env } from "./constants/env";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import sessionRoutes from "./routes/sessionRoutes";
import cors from "cors";


const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // your React frontend origin
    credentials: true, // to allow cookies (e.g. for JWT)
  })
);

const PORT = parseInt(env.PORT, 10) || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/sessions", sessionRoutes);

// Start server after DB connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
