"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const entries = [
  {
    title: "Designing RAG Pipelines for Production",
    tag: "rag",
    slug: "designing-rag-pipelines",
    date: "2026",
    excerpt:
      "Lessons learned from building retrieval-augmented generation systems that scale reliably under real-world constraints.",
  },
  {
    title: "Decorators in Python: A Deep Dive",
    tag: "python",
    slug: "decorators-deep-dive",
    date: "2026",
    excerpt:
      "Exploring the mechanics of decorators beyond the basics -- metaclasses, descriptor protocols, and practical patterns.",
  },
  {
    title: "Why I Chose FastAPI Over Flask",
    tag: "fastapi",
    slug: "why-fastapi-over-flask",
    date: "2024",
    excerpt:
      "A pragmatic comparison of async-first API frameworks for AI-heavy workloads and strict type safety requirements.",
  },
  {
    title: "Vector Databases: Choosing the Right One",
    tag: "systems",
    slug: "vector-databases-comparison",
    date: "2024",
    excerpt:
      "Evaluating FAISS, Chroma, Tantivy, and OpenSearch for different embedding retrieval workloads at enterprise scale.",
  },
]

export function Insights() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up")
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    )
    const items = sectionRef.current?.querySelectorAll("[data-reveal]")
    items?.forEach((el, i) => {
      const element = el as HTMLElement
      element.style.animationDelay = `${i * 100}ms`
      observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="insights"
      className="px-6 md:px-12 lg:px-24 py-28 md:py-36"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
        <div>
          <p className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground mb-4">
            / 05
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Insights
          </h2>
        </div>
        <Link
          href="/insights"
          className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
        >
          <span>View all entries</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
        {entries.map((entry, index) => (
          <Link
            key={index}
            href={`/insights/${entry.tag}/${entry.slug}`}
            data-reveal
            className="opacity-0 group bg-background p-8 md:p-10 transition-all duration-500 hover:bg-secondary"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                  {entry.tag}
                </span>
                <span className="h-px w-4 bg-border" />
                <span className="font-mono text-[10px] text-muted-foreground">
                  {entry.date}
                </span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
            <h3 className="text-lg font-semibold text-foreground tracking-tight leading-snug">
              {entry.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              {entry.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
