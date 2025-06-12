import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().optional(),
  MONGO_URI: z.string(),
  JWT_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
