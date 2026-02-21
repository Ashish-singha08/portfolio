"use client"

import { useEffect, useState, useRef } from "react"
import type { TocHeading } from "@/lib/markdown-utils"

interface ArticleTocProps {
  headings: TocHeading[]
}

export function ArticleToc({ headings }: ArticleTocProps) {
  const [activeId, setActiveId] = useState<string>("")
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const headingElements = document.querySelectorAll("[data-heading]")
    if (headingElements.length === 0) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible heading
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          // Pick the one closest to the top
          const sorted = visible.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          )
          setActiveId(sorted[0].target.id)
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      }
    )

    headingElements.forEach((el) => observerRef.current?.observe(el))

    return () => observerRef.current?.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav aria-label="Table of contents" className="space-y-1">
      <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
        On this page
      </p>
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={`
            block text-[13px] leading-snug py-1.5 transition-colors duration-200
            ${h.level === 3 ? "pl-4" : "pl-0"}
            ${
              activeId === h.id
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground/70"
            }
          `}
        >
          <span
            className={`
              inline-block transition-all duration-200
              ${activeId === h.id ? "translate-x-0 opacity-100" : ""}
            `}
          >
            {h.text}
          </span>
        </a>
      ))}
    </nav>
  )
}
