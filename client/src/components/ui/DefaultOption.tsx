"use client"

import tw from "@/utils/tw"
import { OptionHTMLAttributes, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

interface DefaultOptionProps extends Omit<OptionHTMLAttributes<HTMLOptionElement>, "className"> {
    children: ReactNode
}

export default function DefaultOption({ children, ...props }: Readonly<DefaultOptionProps>) {
    const defaultStyles = {
        option: tw`text-sm/6 capitalize`,
        disabled: tw`disabled:pointer-events-none disabled:text-gray-500`,
        dark: tw`dark:bg-gray-800 dark:hover:bg-gray-700 dark:disabled:bg-gray-600 dark:disabled:text-gray-400`,
    }
    const mergedStyles = twMerge(defaultStyles.option, defaultStyles.disabled, defaultStyles.dark)

    return (
        <option className={mergedStyles} {...props}>
            {children}
        </option>
    )
}
