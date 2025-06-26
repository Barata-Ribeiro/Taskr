"use client"

import tw from "@/utils/tw"
import { Field, Input, Label } from "@headlessui/react"
import { InputHTMLAttributes, useId } from "react"

interface DefaultCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "id" | "className"> {
    label: string
}

export default function DefaultCheckbox({ label, ...props }: Readonly<DefaultCheckboxProps>) {
    const defaultId = useId()

    const defaultStyles = {
        checkbox: tw`appearance-none rounded-sm border border-gray-300 bg-white ring-green-600 checked:border-green-600 checked:bg-green-600 indeterminate:border-green-600 indeterminate:bg-green-600 focus-visible:ring-green-600 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto`,
        label: tw`block text-sm leading-6 text-gray-900`,
    }

    return (
        <Field className="inline-flex items-center gap-x-2">
            <Input id={defaultId} type="checkbox" className={defaultStyles.checkbox} {...props} />
            <Label htmlFor={defaultId} className={defaultStyles.label}>
                {label}
            </Label>
        </Field>
    )
}
