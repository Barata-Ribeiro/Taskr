import sanitizeHtml from "sanitize-html"
import * as z from "zod/v4"

const taskCreateSchema = z.object({
    projectId: z.coerce.number().int(),
    title: z
        .string("Title must not be blank")
        .trim()
        .min(3, "Title must be between 3 and 100 characters")
        .max(100, "Title must be between 3 and 100 characters"),
    summary: z
        .string("Summary must not be blank")
        .trim()
        .min(10, "Summary must be at least 10 characters long")
        .max(255, "Summary must not exceed 255 characters"),
    description: z
        .string("Description must not be blank")
        .trim()
        .min(10, "Description must be at least 10 characters" + " long")
        .transform(val => sanitizeHtml(val)),
    dueDate: z
        .string("Due date must not be blank")
        .regex(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/,
            "Due date must be in ISO-8601 format: yyyy-MM-dd'T'HH:mm[:ss]",
        ),
    status: z.enum(["TO_DO", "IN_PROGRESS", "DONE"], "Status must be one of TO_DO, IN_PROGRESS, or DONE"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"], "Priority must be one of LOW, MEDIUM, HIGH, or URGENT"),
})

const taskUpdateSchema = z.object({
    projectId: z.coerce.number().int(),
    taskId: z.coerce.number().int(),
    title: z
        .string()
        .min(3, "Title must be between 3 and 100 characters")
        .max(100, "Title must be between 3 and 100 characters")
        .optional(),
    summary: z
        .string()
        .min(10, "Summary must be at least 10 characters long")
        .max(255, "Summary must not exceed 255 characters")
        .optional(),
    description: z
        .string()
        .min(10, "Description must be at least 10 characters" + " long")
        .transform(val => sanitizeHtml(val))
        .optional(),
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

const moveTaskSchema = z.object({
    projectId: z.number().min(1, "Project ID is required"),
    newStatus: z.enum(["TO_DO", "IN_PROGRESS", "DONE"], {
        error: "Status must be one of: TO_DO, IN_PROGRESS, DONE",
    }),
    newPosition: z.number().min(1, "Position must be at least 1"),
})

const reorderTasksSchema = z.object({
    status: z.enum(["TO_DO", "IN_PROGRESS", "DONE"], {
        error: "Status must be one of: TO_DO, IN_PROGRESS, DONE",
    }),
    taskIds: z.array(z.number()).min(1, "At least one task ID is required"),
})

export { taskCreateSchema, taskUpdateSchema, moveTaskSchema, reorderTasksSchema }
