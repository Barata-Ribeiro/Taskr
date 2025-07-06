"use client"

import tw from "@/utils/tw"
import { Button } from "@headlessui/react"
import { ButtonHTMLAttributes, type ReactNode } from "react"
import { twMerge } from "tailwind-merge"

interface DefaultButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
    children?: ReactNode
    width?: "full" | "fit" | "auto"
}

export default function DefaultButton({ children, width = "full", ...props }: Readonly<DefaultButtonProps>) {
    const defaultButtonStyles = tw`inline-flex cursor-pointer items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs select-none hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:bg-indigo-700`

    const darkButtonStyles = tw`dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500 dark:active:bg-indigo-600`

    const disabledButtonStyles = tw`disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:grayscale-100`

    const widthStyles = {
        full: "w-full",
        fit: "w-fit",
        auto: "w-auto",
    }

    const buttonClass = twMerge(defaultButtonStyles, darkButtonStyles, disabledButtonStyles, widthStyles[width])

    return (
        <Button className={buttonClass} {...props}>
            {children}
        </Button>
    )
}
