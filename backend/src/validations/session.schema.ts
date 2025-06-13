import { z } from "zod";

export const createSessionSchema = z.object({
  taskId: z.string().optional(),
  startTime: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid startTime format",
  }),
  endTime: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid endTime format",
  }),
  type: z.enum(["focus", "break"]),
});
