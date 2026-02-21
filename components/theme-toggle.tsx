"use client"

import { useEffect, useState } from "react"
import { Moon, Sun, BookOpen } from "lucide-react"

type Theme = "dark" | "light" | "sepia"

const themes: { key: Theme; icon: typeof Moon; label: string }[] = [
  { key: "dark", icon: Moon, label: "Dark" },
  { key: "light", icon: Sun, label: "Light" },
  { key: "sepia", icon: BookOpen, label: "Sepia" },
]

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null
    if (stored === "light" || stored === "sepia") {
      setTheme(stored)
    }
    setMounted(true)
  }, [])

  function applyTheme(next: Theme) {
    const root = document.documentElement.classList
    root.remove("dark", "light", "sepia")
    if (next !== "dark") {
      root.add(next)
    }
    localStorage.setItem("theme", next)
    setTheme(next)
  }

  function cycle() {
    const order: Theme[] = ["dark", "light", "sepia"]
    const nextIndex = (order.indexOf(theme) + 1) % order.length
    applyTheme(order[nextIndex])
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return <div className="h-8 w-8" aria-hidden />
  }

  const current = themes.find((t) => t.key === theme)!
  const Icon = current.icon

  return (
    <button
      onClick={cycle}
      className="group relative flex items-center justify-center h-8 w-8 rounded-md transition-all duration-300 hover:bg-secondary"
      aria-label={`Switch theme (current: ${current.label})`}
      title={`Theme: ${current.label}`}
    >
      <Icon className="h-[14px] w-[14px] text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
    </button>
  )
}
