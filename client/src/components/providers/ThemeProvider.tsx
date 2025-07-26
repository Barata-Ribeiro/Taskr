"use client"

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react"

type Themes = "dark" | "light"
type ThemeContextType = { theme: Themes; setTheme: (t: Themes) => void }

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: Readonly<{ children: ReactNode }>) {
    const [theme, setTheme] = useState<Themes>("light")

    useEffect(() => {
        const savedTheme =
            (localStorage.getItem("theme") as Themes) ??
            (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        setTheme(savedTheme)
    }, [])

    useEffect(() => {
        document.documentElement?.setAttribute("data-theme", theme)
        document.documentElement?.setAttribute("data-color-mode", theme)
        localStorage.setItem("theme", theme)
    }, [theme])

    const contextValue = useMemo(() => ({ theme, setTheme }), [theme])
    return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) throw new Error("useTheme must be used within ThemeProvider")
    return context
}
