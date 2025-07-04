import * as z from "zod/v4"

const taskCreateSchema = z.object({
    projectId: z.number().min(1, "The project ID cannot be blank"),
    title: z
        .string()
        .min(3, "Title must be between 3 and 100 characters")
        .max(100, "Title must be between 3 and 100 characters"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    dueDate: z
        .string()
        .regex(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/,
            "Due date must be in ISO-8601 format: yyyy-MM-dd'T'HH:mm[:ss]",
        ),
    status: z.enum(["TO_DO", "IN_PROGRESS", "DONE"], { error: "Status must be one of TO_DO, IN_PROGRESS, or DONE" }),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"], {
        error: "Priority must be one of LOW, MEDIUM, HIGH, or URGENT",
    }),
})

const taskUpdateSchema = z.object({
    projectId: z.number().min(1, "The project ID cannot be blank"),
    title: z
        .string()
        .min(3, "Title must be between 3 and 100 characters")
        .max(100, "Title must be between 3 and 100 characters")
        .optional(),
    description: z.string().min(10, "Description must be at least 10 characters long").optional(),
    dueDate: z
        .string()
        .regex(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/,
            "Due date must be in ISO-8601 format: yyyy-MM-dd'T'HH:mm[:ss]",
        )
        .optional(),
    status: z
        .enum(["TO_DO", "IN_PROGRESS", "DONE"], { error: "Status must be one of TO_DO, IN_PROGRESS, or DONE" })
        .optional(),
    priority: z
        .enum(["LOW", "MEDIUM", "HIGH", "URGENT"], {
            error: "Priority must be one of LOW, MEDIUM, HIGH, or URGENT",
        })
        .optional(),
    membersToAssign: z.array(z.string()).optional(),
    membersToUnassign: z.array(z.string()).optional(),
})

export { taskCreateSchema, taskUpdateSchema }
