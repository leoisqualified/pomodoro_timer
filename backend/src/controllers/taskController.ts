import { Request, Response } from "express";
import Task from "../models/Task";
import { createTaskSchema, updateTaskSchema } from "../validations/task.schema";
import { z } from "zod";
import { AuthRequest } from "../middlewares/authenticate";

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = createTaskSchema.parse(req.body);

    const task = await Task.create({
      title,
      description,
      userId: req.user!.id,
    });

    return res.status(201).json(task);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: err.errors });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  const tasks = await Task.find({ userId: req.user!.id }).sort({
    createdAt: -1,
  });
  res.json(tasks);
};

export const getTask = async (req: AuthRequest, res: Response) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user!.id });

  if (!task) return res.status(404).json({ message: "Task not found" });

  res.json(task);
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const updates = updateTaskSchema.parse(req.body);

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!.id },
      updates,
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: err.errors });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    userId: req.user!.id,
  });

  if (!task) return res.status(404).json({ message: "Task not found" });

  res.json({ message: "Task deleted" });
};
