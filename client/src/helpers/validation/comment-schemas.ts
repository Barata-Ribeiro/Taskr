import sanitizeHtml from "sanitize-html"
import { z } from "zod/v4"

const createCommentSchema = z
    .object({
        projectId: z.coerce.number().int(),
        taskId: z.coerce.number().int(),
        parentId: z.coerce.number().nullish().or(z.literal(0)),
        body: z
            .string("Comment must not be empty.")
            .min(5, "Comment must be at least 5 characters.")
            .transform(val => sanitizeHtml(val)),
    })
    .transform(data => {
        if (data.parentId === 0) delete data.parentId
        return data
    })

const updateCommentSchema = z.object({
    projectId: z.coerce.number().int(),
    taskId: z.coerce.number().int(),
    commentId: z.coerce.number().int(),
    body: z
        .string("Comment must not be empty.")
        .min(5, "Comment must be at least 5 characters.")
        .transform(val => sanitizeHtml(val)),
})

export { createCommentSchema, updateCommentSchema }
