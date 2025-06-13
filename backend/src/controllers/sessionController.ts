import { Request, Response } from "express";
import { z } from "zod";
import Session from "../models/Session";
import { createSessionSchema } from "../validations/session.schema";
import { AuthRequest } from "../middlewares/authenticate";

export const createSession = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId, startTime, endTime, type } = createSessionSchema.parse(
      req.body
    );

    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = Math.round((end.getTime() - start.getTime()) / 60000); // minutes

    const session = await Session.create({
      userId: req.user!.id,
      taskId,
      startTime: start,
      endTime: end,
      duration,
      type,
    });

    return res.status(201).json(session);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: err.errors });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getSessions = async (req: AuthRequest, res: Response) => {
  const sessions = await Session.find({ userId: req.user!.id }).sort({
    createdAt: -1,
  });
  res.json(sessions);
};
