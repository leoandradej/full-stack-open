import z from "zod";
import { Gender, HealthCheckRating } from "./types";

const baseEntrySchema = z.object({
  id: z.string(),
  date: z.iso.date({
    message: "Invalid date format. Expected format: YYYY-MM-DD",
  }),
  specialist: z.string().min(1, "Specialist is required"),
  description: z.string().min(1, "Description is required"),
  diagnosisCodes: z.array(z.string()).optional(),
});

const hospitalSchema = z
  .object({
    type: z.literal("Hospital"),
    discharge: z.object({
      date: z.iso.date({
        message: "Invalid date format. Expected format: YYYY-MM-DD",
      }),
      criteria: z.string().min(1, "Discharge criteria is required"),
    }),
  })
  .extend(baseEntrySchema.shape);

const occupationalHealthcareSchema = z
  .object({
    type: z.literal("OccupationalHealthcare"),
    employerName: z.string().min(1, "Employer name is required"),
    sickLeave: z
      .object({
        startDate: z.iso.date({
          message: "Invalid date format. Expected format: YYYY-MM-DD",
        }),
        endDate: z.iso.date({
          message: "Invalid date format. Expected format: YYYY-MM-DD",
        }),
      })
      .optional(),
  })
  .extend(baseEntrySchema.shape);

const healthCheckSchema = z
  .object({
    type: z.literal("HealthCheck"),
    healthCheckRating: z.enum(HealthCheckRating),
  })
  .extend(baseEntrySchema.shape);

const entrySchema = z.discriminatedUnion("type", [
  hospitalSchema,
  occupationalHealthcareSchema,
  healthCheckSchema,
]);

// Entry Schema No ID

const newBaseEntrySchema = z.object({
  date: z.iso.date({
    message: "Invalid date format. Expected format: YYYY-MM-DD",
  }),
  specialist: z.string().min(1, "Specialist is required"),
  description: z.string().min(1, "Description is required"),
  diagnosisCodes: z.array(z.string()).optional(),
});

const newHospitalSchema = z
  .object({
    type: z.literal("Hospital"),
    discharge: z.object({
      date: z.iso.date({
        message: "Invalid date format. Expected format: YYYY-MM-DD",
      }),
      criteria: z.string().min(1, "Discharge criteria is required"),
    }),
  })
  .extend(newBaseEntrySchema.shape);

const newOccupationalHealthcareSchema = z
  .object({
    type: z.literal("OccupationalHealthcare"),
    employerName: z.string().min(1, "Employer name is required"),
    sickLeave: z
      .object({
        startDate: z.iso.date({
          message: "Invalid date format. Expected format: YYYY-MM-DD",
        }),
        endDate: z.iso.date({
          message: "Invalid date format. Expected format: YYYY-MM-DD",
        }),
      })
      .optional(),
  })
  .extend(newBaseEntrySchema.shape);

const newHealthCheckSchema = z
  .object({
    type: z.literal("HealthCheck"),
    healthCheckRating: z.enum(HealthCheckRating),
  })
  .extend(newBaseEntrySchema.shape);

export const newEntrySchema = z.discriminatedUnion("type", [
  newHospitalSchema,
  newOccupationalHealthcareSchema,
  newHealthCheckSchema,
]);

// Patient Schema

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
  entries: z.array(entrySchema).default([]),
});
