"use client"

import { useTheme } from "@/components/providers/ThemeProvider"
import { Moon, SunDim } from "lucide-react"

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme()

    const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light")

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
