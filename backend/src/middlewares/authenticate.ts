import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../constants/env";

export interface AuthRequest extends Request {
  user?: { id: string; username: string };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      username: string;
    };

    req.user = { id: payload.id, username: payload.username };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
