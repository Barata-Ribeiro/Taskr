"use client"

import { Moon, SunDim } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

type Themes = "dark" | "light"

export default function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false)
    const [theme, setTheme] = useState<Themes>("light")

    useEffect(() => {
        setMounted(true)
        const savedTheme =
            (localStorage.getItem("theme") as Themes) ??
            (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        setTheme(savedTheme)
    }, [])

    useEffect(() => {
        if (mounted) {
            document.documentElement?.setAttribute("data-theme", theme)
            localStorage.setItem("theme", theme)
        }
    }, [mounted, theme])

    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"))
    }, [])

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="fixed right-0 bottom-0 z-1000 m-4 cursor-pointer rounded-full bg-yellow-200 p-2 shadow-lg dark:bg-indigo-700"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
            {theme === "light" ? <SunDim aria-hidden size={20} /> : <Moon aria-hidden size={20} />}
        </button>
    )
}
