"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface InsightsNavbarProps {
  backHref: string
  backLabel: string
  rightLabel?: string
}

export function InsightsNavbar({
  backHref,
  backLabel,
  rightLabel,
}: InsightsNavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10)

    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    if (docHeight > 0) {
      setProgress(Math.min((window.scrollY / docHeight) * 100, 100))
    }
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl"
          : "bg-background"
      }`}
    >
      <nav className="flex items-center justify-between px-6 md:px-12 lg:px-24 h-16 border-b border-border">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">{backLabel}</span>
        </Link>

        <div className="flex items-center gap-4">
          {rightLabel && (
            <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground hidden sm:block">
              {rightLabel}
            </span>
          )}
          <ThemeToggle />
        </div>
      </nav>

      {/* Reading progress bar */}
      <div className="h-[2px] w-full bg-transparent">
        <div
          className="h-full bg-foreground transition-[width] duration-100 ease-out"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Reading progress"
        />
      </div>
    </header>
  )
}
