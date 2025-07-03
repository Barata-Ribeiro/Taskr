import * as z from "zod/v4"

const createProjectSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be between 3 and 100 characters")
        .max(100, "Title must be between 3 and 100 characters"),
    description: z.string().min(1, "Description is required"),
    dueDate: z
        .string()
        .regex(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/,
            "Due date must be in ISO-8601 format: yyyy-MM-dd'T'HH:mm[:ss]",
        )
        .refine(
            date => {
                const inputDate = new Date(date)
                inputDate.setHours(0, 0, 0, 0)
                const now = new Date()
                now.setHours(0, 0, 0, 0)
                return inputDate > now
            },
            { error: "Due date must be in the future (not today or past)" },
        ),
})

export { createProjectSchema }
