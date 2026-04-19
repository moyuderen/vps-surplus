"use client"

import * as React from "react"

type Theme = "light" | "dark" | "system"
type ResolvedTheme = Exclude<Theme, "system">

type ThemeContextValue = {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const STORAGE_KEY = "theme"
const MEDIA_QUERY = "(prefers-color-scheme: dark)"
const ThemeContext = React.createContext<ThemeContextValue | null>(null)

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark" || value === "system"
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return "system"
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEY)
  return isTheme(storedTheme) ? storedTheme : "system"
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light"
  }

  return window.matchMedia(MEDIA_QUERY).matches ? "dark" : "light"
}

function applyTheme(theme: Theme) {
  const resolvedTheme = resolveTheme(theme)
  const root = document.documentElement

  root.classList.remove("light", "dark")
  root.classList.add(resolvedTheme)
  root.style.colorScheme = resolvedTheme
}

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [theme, setTheme] = React.useState<Theme>(() => getStoredTheme())
  const resolvedTheme = resolveTheme(theme)

  React.useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, theme)
    applyTheme(theme)
  }, [theme])

  React.useEffect(() => {
    const mediaQueryList = window.matchMedia(MEDIA_QUERY)

    const handleMediaChange = () => {
      if (theme === "system") {
        applyTheme("system")
      }
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) {
        return
      }

      const nextTheme = isTheme(event.newValue) ? event.newValue : "system"
      setTheme(nextTheme)
    }

    mediaQueryList.addEventListener("change", handleMediaChange)
    window.addEventListener("storage", handleStorage)

    return () => {
      mediaQueryList.removeEventListener("change", handleMediaChange)
      window.removeEventListener("storage", handleStorage)
    }
  }, [theme])

  const value = React.useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [resolvedTheme, theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = React.useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }

  return context
}

export type { Theme, ResolvedTheme }
