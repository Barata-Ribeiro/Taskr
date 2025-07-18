"use client"

import { useTheme } from "@/components/providers/ThemeProvider"
import { Fragment, type ReactNode } from "react"
import { Bounce, ToastContainer, ToastContainerProps } from "react-toastify"

interface ToastProviderProps {
    children: ReactNode
}

export default function ToastProvider({ children }: Readonly<ToastProviderProps>) {
    const { theme } = useTheme()

    const toastOptions: ToastContainerProps = {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        newestOnTop: true,
        closeOnClick: true,
        rtl: false,
        pauseOnFocusLoss: false,
        pauseOnHover: false,
        theme,
        transition: Bounce,
    }

    return (
        <Fragment>
            {children}
            <ToastContainer key={theme} {...toastOptions} />
        </Fragment>
    )
}
