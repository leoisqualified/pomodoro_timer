import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { env } from "../constants/env";
import { registerSchema, loginSchema } from "../validations/auth.schema";
import { z } from "zod";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = registerSchema.parse(req.body);

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const user = await User.create({ username, password });

    return res.status(201).json({
      message: "User registered",
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: err.errors });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { id: user._id, username: user.username };

    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    res
      .cookie("token", accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 15,
        sameSite: "lax",
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: "lax",
      })
      .status(200)
      .json({ message: "Login successful", user: payload });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: err.errors });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProfile = (req: Request, res: Response) => {
  const user = (req as any).user; // We'll fix the type once auth middleware is added
  return res.json({ user });
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  return res.json({ message: "Logged out" });
};

export const refreshAccessToken = (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const payload = jwt.verify(token, env.REFRESH_TOKEN_SECRET) as {
      id: string;
      username: string;
    };

    const newAccessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: "15m",
    });

    res.cookie("token", newAccessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 15,
      sameSite: "lax",
    });

    return res.json({ message: "Access token refreshed" });
  } catch {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};
