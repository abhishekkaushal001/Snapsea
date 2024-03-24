import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
});

export const messageSchema = z.object({
  id: z.string(),
  senderId: z.string(),
  text: z.string(),
  timeStamp: z.number(),
});

export type Message = z.infer<typeof messageSchema>;
