import * as z from "zod/v4"

const adminProfileUpdateSchema = z
    .object({
        currentUsername: z.string("Current Username is required").trim(),
        username: z
            .string("Invalid Username format")
            .trim()
            .max(50, "Username must be at most 50 characters")
            .regex(/^[a-z]*$/, "Username must contain only lowercase letters")
            .nullish(),
        displayName: z
            .string("Invalid Display Name format")
            .trim()
            .max(50, "Display Name must be at most 50 characters")
            .regex(/^[a-zA-Z\s]*$/, "Display Name must contain only letters and spaces")
            .nullish(),
        bio: z.string("Bio is required").trim().max(200, "Bio must be at most 200 characters").nullish(),
        email: z.string("Invalid Email format").trim().nullish(),
        firstName: z
            .string("Invalid First Name format")
            .trim()
            .max(50, "First Name must be at most 50 characters")
            .regex(/^[a-zA-Z\s]*$/, "First Name must contain only letters and spaces")
            .nullish(),
        lastName: z
            .string("Invalid Last Name format")
            .trim()
            .max(50, "Last Name must be at most 50 characters")
            .regex(/^[a-zA-Z\s]*$/, "Last Name must contain only letters and spaces")
            .nullish(),
        pronouns: z.string("Invalid Pronoun format").trim().max(50, "Pronouns must be at most 50 characters").nullish(),
        location: z
            .string("Invalid Location format")
            .trim()
            .max(100, "Location must be at most 100 characters")
            .nullish(),
        website: z.string("Invalid Website format").trim().nullish(),
        company: z.string("Invalid Company format").trim().max(100, "Company must be at most 100 characters").nullish(),
        jobTitle: z
            .string("Invalid Job Title format")
            .trim()
            .max(100, "Job Title must be at most 100 characters")
            .nullish(),
    })
    .transform(data => {
        const mutableData = { ...data } as Record<string, unknown>
        const firstName = mutableData.firstName as string | undefined
        const lastName = mutableData.lastName as string | undefined

        if (firstName || lastName) {
            mutableData.fullName = [firstName, lastName].filter(Boolean).join(" ").trim()
            delete mutableData.firstName
            delete mutableData.lastName
        }

        Object.entries(mutableData).forEach(([key, value]) => {
            if (value === "" || value == null) delete mutableData[key]
        })
        return mutableData
    })

export { adminProfileUpdateSchema }
