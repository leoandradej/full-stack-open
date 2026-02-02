import z from "zod";
import { Gender } from "./types";

export const newPatientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  occupation: z.string().min(1, "Occupation is required"),
  gender: z.enum(Gender),
  ssn: z
    .string()
    .regex(/^\d{6}-\d{3,4}[A-Z0-9]$/, "Invalid Finnish SSN format")
    .optional(),
  dateOfBirth: z.iso.date({
    message: "Incorrect date format. Expected format: YYYY-MM-DD",
  }),
});
