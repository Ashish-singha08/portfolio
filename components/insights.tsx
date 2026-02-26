"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowUpRight, Sparkles } from "lucide-react"

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
    title: "Python Functions: Arguments, Scope, Lambdas, and First-Class Behavior",
    tag: "python",
    slug: "functions",
    date: "2026",
    excerpt:
      "A practical guide to how Python functions work — from how you pass arguments to how variables are scoped and why functions are more powerful than they first appear.",
  },
  {
    title: "Why I Chose FastAPI Over Flask",
    tag: "fastapi",
    slug: "why-fastapi-over-flask",
    date: "2026",
    excerpt:
      "A pragmatic comparison of async-first API frameworks for AI-heavy workloads and strict type safety requirements.",
  },
  {
    title: "Vector Databases: Choosing the Right One",
    tag: "systems",
    slug: "vector-databases-comparison",
    date: "2026",
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

      {/* Ask CTA — the X factor */}
      <Link
        href="/insights"
        data-reveal
        className="opacity-0 group block mb-12 p-8 md:p-10 border border-border bg-card/30 hover:bg-secondary/50 transition-all duration-500 relative overflow-hidden"
      >
        {/* Animated accent */}
        <div className="absolute top-0 left-0 h-full w-1 bg-foreground/10 group-hover:bg-foreground/30 transition-colors duration-500" />
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="mt-1 p-2 border border-border/50 bg-background/50">
              <Sparkles className="h-4 w-4 text-foreground/60" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground tracking-tight mb-2">
                Ask my knowledge base anything
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                RAG-powered search across all my writings. Ask about embeddings, vector databases, AI architecture, or anything I've written about.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300 md:flex-shrink-0">
            <span className="font-mono text-[11px] tracking-wider uppercase">Try it</span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>

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
