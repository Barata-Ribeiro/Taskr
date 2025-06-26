"use client"

import tw from "@/utils/tw"
import { Description, Field, Input, Label } from "@headlessui/react"
import { InputHTMLAttributes, useId } from "react"
import { twMerge } from "tailwind-merge"

interface DefaultInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
    label?: string
    description?: string
}

export default function DefaultInput({ label, description, ...props }: Readonly<DefaultInputProps>) {
    const defaultId = useId()

    const defaultStyles = {
        label: tw`block text-sm/6 font-medium text-gray-900 data-disabled:opacity-50`,
        description: tw`text-sm/6 text-gray-500 data-disabled:opacity-50`,
        input: tw`block w-full rounded-md border-none bg-white px-3 py-1.5 text-base text-gray-900 ring-indigo-200 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 data-disabled:bg-gray-100 sm:text-sm/6`,
    }

    const mergedInputStyles = twMerge(defaultStyles.input, props.className)

    return (
        <Field disabled={props.disabled}>
            {label && (
                <Label htmlFor={defaultId} className={defaultStyles.label}>
                    {label}
                </Label>
            )}
            {description && <Description className={defaultStyles.description}>{description}</Description>}
            <Input id={defaultId} {...props} className={mergedInputStyles} />
        </Field>
    )
}
