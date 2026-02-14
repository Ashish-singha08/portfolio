"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { PostMeta } from "@/lib/content"

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function InsightsList({
  posts,
  categories,
}: {
  posts: PostMeta[]
  categories: string[]
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const filtered = activeCategory
    ? posts.filter((p) => p.category === activeCategory)
    : posts

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up")
          }
        })
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    )
    const items = listRef.current?.querySelectorAll("[data-reveal]")
    items?.forEach((el, i) => {
      const element = el as HTMLElement
      element.style.opacity = "0"
      element.style.animationDelay = `${i * 80}ms`
      observer.observe(el)
    })
    return () => observer.disconnect()
  }, [filtered])

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap items-center gap-3 mb-16">
        <button
          onClick={() => setActiveCategory(null)}
          className={`font-mono text-xs tracking-widest uppercase px-4 py-2.5 border transition-all duration-300 ${
            activeCategory === null
              ? "border-foreground bg-foreground text-background"
              : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground"
          }`}
        >
          All
          <span className="ml-2 text-[10px] opacity-60">{posts.length}</span>
        </button>
        {categories.map((cat) => {
          const count = posts.filter((p) => p.category === cat).length
          return (
            <button
              key={cat}
              onClick={() =>
                setActiveCategory(activeCategory === cat ? null : cat)
              }
              className={`font-mono text-xs tracking-widest uppercase px-4 py-2.5 border transition-all duration-300 ${
                activeCategory === cat
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              {cat}
              <span className="ml-2 text-[10px] opacity-60">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Posts */}
      <div ref={listRef} className="border-t border-border">
        {filtered.map((post) => (
          <Link
            key={`${post.category}-${post.slug}`}
            href={`/insights/${post.category}/${post.slug}`}
            data-reveal
            className="group flex flex-col md:flex-row md:items-start gap-4 md:gap-12 py-10 border-b border-border transition-all duration-500 hover:pl-2 md:hover:pl-4"
          >
            {/* Left column: meta */}
            <div className="shrink-0 md:w-44 flex items-center gap-4">
              <span className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
                {post.category}
              </span>
              <span className="h-px w-3 bg-border hidden md:block" />
              <span className="font-mono text-[11px] text-muted-foreground hidden md:block">
                {formatDate(post.date)}
              </span>
            </div>

            {/* Right column: content */}
            <div className="flex-1 flex items-start justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-lg md:text-xl font-semibold text-foreground tracking-tight leading-snug group-hover:text-foreground/80 transition-colors duration-300">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2 max-w-xl">
                  {post.summary}
                </p>
                <span className="font-mono text-[11px] text-muted-foreground md:hidden mt-2 block">
                  {formatDate(post.date)}
                </span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 shrink-0 mt-1.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-sm text-muted-foreground">
            No entries in this category yet.
          </p>
        </div>
      )}
    </div>
  )
}
