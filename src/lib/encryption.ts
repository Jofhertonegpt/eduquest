import { z } from "zod";

export const curriculumSchema = z.object({
  name: z.string(),
  description: z.string(),
  programOutcomes: z.array(z.string()),
  institution: z.string(),
  complianceStandards: z.array(z.string()),
  degrees: z.array(z.object({
    id: z.string(),
    title: z.string(),
    type: z.string(), // Removed enum restriction to allow "undergraduate"
    description: z.string(),
    requiredCredits: z.number(),
    metadata: z.object({
      academicYear: z.string(),
      deliveryFormat: z.string(),
      department: z.string()
    }),
    courses: z.array(z.union([
      z.string(), // Allow string course IDs
      z.object({ // Also allow full course objects
        id: z.string(),
        title: z.string(),
        description: z.string(),
        credits: z.number(),
        level: z.string(),
        modules: z.array(z.any()).optional()
      })
    ]))
  }))
});