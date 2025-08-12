"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useSettings } from "@/hooks/use-settings"

type Theme = "light" | "dark" | "auto"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark"
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings, saveSettings, isLoaded } = useSettings()
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    if (!isLoaded) return

    const updateTheme = () => {
      let newTheme: "light" | "dark" = "light"

      if (settings.theme === "auto") {
        newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      } else {
        newTheme = settings.theme
      }

      setResolvedTheme(newTheme)

      document.documentElement.classList.remove("light", "dark")
      document.documentElement.classList.add(newTheme)
      document.documentElement.setAttribute("data-theme", newTheme)
    }

    updateTheme()

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      if (settings.theme === "auto") {
        updateTheme()
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [settings.theme, isLoaded])

  const setTheme = (theme: Theme) => {
    saveSettings({ theme })
  }

  return (
    <ThemeContext.Provider value={{ theme: settings.theme, setTheme, resolvedTheme }}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
