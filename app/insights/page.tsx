import Link from "next/link"
import { getAllPosts, getCategories } from "@/lib/content"
import { InsightsList } from "@/components/insights-list"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Insights — Ashish Singhal",
  description:
    "Engineering knowledge log. Notes on Python, RAG, FastAPI, and systems architecture.",
}

export default function InsightsPage() {
  const posts = getAllPosts()
  const categories = getCategories()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border">
        <nav className="flex items-center justify-between px-6 md:px-12 lg:px-24 h-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-mono text-sm tracking-tight">AS.</span>
          </Link>
          <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
            Knowledge Log
          </span>
        </nav>
      </header>

      <main className="px-6 md:px-12 lg:px-24 pt-20 pb-32">
        {/* Title */}
        <div className="max-w-3xl mb-20">
          <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-4">
            / Insights
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground leading-[0.95] text-balance">
            Engineering
            <br />
            Knowledge Log
          </h1>
          <p className="text-sm text-muted-foreground mt-6 leading-relaxed max-w-lg">
            Technical notes, architecture decisions, and lessons from building
            production AI systems. Organized by domain.
          </p>
        </div>

        {/* Category + posts client component */}
        <InsightsList posts={posts} categories={categories} />
      </main>

      <footer className="px-6 md:px-12 lg:px-24 py-8 border-t border-border">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs text-muted-foreground">
            {"© 2025 — Ashish Singhal"}
          </p>
          <Link
            href="/"
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to portfolio
          </Link>
        </div>
      </footer>
    </div>
  )
}
