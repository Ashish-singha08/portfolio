"use client"

import { useState, useEffect, useCallback } from "react"
import { Settings, X } from "lucide-react"

type FontSize = "small" | "medium" | "large"
type LineSpacing = "compact" | "comfortable" | "relaxed"
type ContentWidth = "narrow" | "standard" | "wide"

const FONT_SIZES: Record<FontSize, string> = {
  small: "17",
  medium: "19",
  large: "21",
}

const LINE_HEIGHTS: Record<LineSpacing, string> = {
  compact: "1.6",
  comfortable: "1.78",
  relaxed: "1.95",
}

const CONTENT_WIDTHS: Record<ContentWidth, string> = {
  narrow: "640",
  standard: "768",
  wide: "900",
}

interface Prefs {
  fontSize: FontSize
  lineSpacing: LineSpacing
  contentWidth: ContentWidth
}

const DEFAULT_PREFS: Prefs = {
  fontSize: "medium",
  lineSpacing: "comfortable",
  contentWidth: "standard",
}

function applyPrefs(prefs: Prefs) {
  const root = document.documentElement
  root.style.setProperty("--reading-font-size", `${FONT_SIZES[prefs.fontSize]}px`)
  root.style.setProperty("--reading-line-height", LINE_HEIGHTS[prefs.lineSpacing])
  root.style.setProperty("--reading-max-width", `${CONTENT_WIDTHS[prefs.contentWidth]}px`)
}

function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem("reading-prefs")
    if (raw) return { ...DEFAULT_PREFS, ...JSON.parse(raw) }
  } catch {}
  return DEFAULT_PREFS
}

export function ReadingPreferences() {
  const [open, setOpen] = useState(false)
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const loaded = loadPrefs()
    setPrefs(loaded)
    applyPrefs(loaded)
    setMounted(true)
  }, [])

  const update = useCallback(
    (partial: Partial<Prefs>) => {
      const next = { ...prefs, ...partial }
      setPrefs(next)
      applyPrefs(next)
      try {
        localStorage.setItem("reading-prefs", JSON.stringify(next))
      } catch {}
    },
    [prefs]
  )

  if (!mounted) return null

  return (
    <>
      {/* Gear trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-all duration-200 shadow-lg"
        aria-label="Reading preferences"
      >
        <Settings className="h-4 w-4" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-background/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto max-w-lg bg-card border border-border border-b-0 rounded-t-xl px-6 py-6 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
              Reading preferences
            </p>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Font size */}
          <div className="mb-5">
            <p className="text-[12px] text-muted-foreground mb-2.5">Font size</p>
            <div className="flex gap-2">
              {(["small", "medium", "large"] as FontSize[]).map((v) => (
                <button
                  key={v}
                  onClick={() => update({ fontSize: v })}
                  className={`flex-1 py-2 text-[12px] font-medium rounded-md border transition-all duration-150 ${
                    prefs.fontSize === v
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground"
                  }`}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Line spacing */}
          <div className="mb-5">
            <p className="text-[12px] text-muted-foreground mb-2.5">Line spacing</p>
            <div className="flex gap-2">
              {(["compact", "comfortable", "relaxed"] as LineSpacing[]).map((v) => (
                <button
                  key={v}
                  onClick={() => update({ lineSpacing: v })}
                  className={`flex-1 py-2 text-[12px] font-medium rounded-md border transition-all duration-150 ${
                    prefs.lineSpacing === v
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground"
                  }`}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Content width */}
          <div>
            <p className="text-[12px] text-muted-foreground mb-2.5">Content width</p>
            <div className="flex gap-2">
              {(["narrow", "standard", "wide"] as ContentWidth[]).map((v) => (
                <button
                  key={v}
                  onClick={() => update({ contentWidth: v })}
                  className={`flex-1 py-2 text-[12px] font-medium rounded-md border transition-all duration-150 ${
                    prefs.contentWidth === v
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground"
                  }`}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
