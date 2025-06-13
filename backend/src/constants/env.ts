import dotenv from "dotenv";
import { z } from "zod";

dotenv.config(); // ✅ Load env vars before parsing

const envSchema = z.object({
  PORT: z.string().default("5000"),
  MONGO_URI: z.string(),
  JWT_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
