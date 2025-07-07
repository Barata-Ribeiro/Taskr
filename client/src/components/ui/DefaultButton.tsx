"use client"

import tw from "@/utils/tw"
import { Button } from "@headlessui/react"
import { ButtonHTMLAttributes, type ReactNode } from "react"
import { twMerge } from "tailwind-merge"

interface DefaultButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
    children?: ReactNode
    width?: "full" | "fit" | "auto"
    buttonType?: "color" | "ghost"
    isIconOnly?: boolean
}

export default function DefaultButton({
    children,
    width = "full",
    buttonType = "color",
    isIconOnly = false,
    ...props
}: Readonly<DefaultButtonProps>) {
    const defaultButtonStyles = tw`inline-flex cursor-pointer items-center justify-center gap-x-2 rounded-md text-sm/6 font-semibold shadow-xs select-none focus-visible:outline-2 focus-visible:outline-offset-2`

    const typeStyles = {
        color: tw`bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600 active:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500 dark:active:bg-indigo-600`,
        ghost: tw`border border-transparent bg-transparent shadow-none hover:border-gray-200 hover:bg-gray-100 hover:shadow-none focus-visible:outline-gray-200 active:bg-gray-200 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:active:bg-gray-700`,
    }

    const disabledButtonStyles = tw`disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:grayscale-100`

    const paddingStyles = isIconOnly ? "p-2.5" : "px-3 py-1.5"

    const widthStyles = {
        full: "w-full",
        fit: "w-fit",
        auto: "w-auto",
    }

    const buttonClass = twMerge(
        defaultButtonStyles,
        typeStyles[buttonType],
        disabledButtonStyles,
        paddingStyles,
        widthStyles[width],
    )

    return (
        <Button className={buttonClass} {...props}>
            {children}
        </Button>
    )
}
