"use client"

import tw from "@/utils/tw"
import { Field, Input, Label } from "@headlessui/react"
import { InputHTMLAttributes, Ref, useId } from "react"
import { twMerge } from "tailwind-merge"

interface DefaultCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "id" | "className"> {
    label?: string
    ref?: Ref<HTMLInputElement>
}

export default function DefaultCheckbox({ label, ref, ...props }: Readonly<DefaultCheckboxProps>) {
    const defaultId = useId()

    const defaultStyles = {
        checkbox: tw`cursor-pointer appearance-none rounded-sm border border-gray-300 bg-white ring-green-600 checked:border-green-600 checked:bg-green-600 indeterminate:border-green-600 indeterminate:bg-green-600 focus-visible:ring-green-600 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto`,
        label: tw`block text-sm leading-6`,
    }

    const darkCheckboxStyles = tw`dark:border-gray-700 dark:bg-gray-800 dark:checked:border-green-500 dark:checked:bg-green-500 dark:indeterminate:border-green-500 dark:indeterminate:bg-green-500`

    const mergedCheckboxStyles = twMerge(defaultStyles.checkbox, darkCheckboxStyles)

    return (
        <Field className="inline-flex items-center gap-x-2">
            <Input id={defaultId} ref={ref} type="checkbox" className={mergedCheckboxStyles} {...props} />
            {label && (
                <Label htmlFor={defaultId} className={defaultStyles.label}>
                    {label}
                </Label>
            )}
        </Field>
    )
}
