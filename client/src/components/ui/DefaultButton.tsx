"use client"

import { Button } from "@headlessui/react"
import { ButtonHTMLAttributes, type ReactNode } from "react"

interface DefaultButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode
}

export default function DefaultButton({ children, ...props }: Readonly<DefaultButtonProps>) {
    return <Button {...props}>{children}</Button>
}
