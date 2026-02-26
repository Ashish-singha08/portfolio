import Link from "next/link"
import { getAllPosts, getCategories } from "@/lib/content"
import { InsightsList } from "@/components/insights-list"
import { InsightsNavbar } from "@/components/insights-navbar"
import { AskInsight } from "@/components/ask-insight"

export const metadata = {
  title: "Insights — Ashish Singhal",
  description: "Engineering knowledge log. Notes on Python, RAG, FastAPI, and systems architecture.",
  alternates: {
    canonical: '/insights',
  },
}

export default function InsightsPage() {
  const posts = getAllPosts()
  const categories = getCategories()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <InsightsNavbar
        backHref="/"
        backLabel="AS."
        rightLabel="Knowledge Log"
      />

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

        {/* Ask — the entry point to knowledge */}
        <AskInsight />

        {/* Category + posts client component */}
        <InsightsList posts={posts} categories={categories} />
      </main>

      <footer className="px-6 md:px-12 lg:px-24 py-8 border-t border-border">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs text-muted-foreground">
            {"© 2026 — Ashish Singhal"}
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
