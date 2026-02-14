import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getPost, getAllPosts } from "@/lib/content"
import { MarkdownRenderer } from "@/components/markdown-renderer"

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((p) => ({ category: p.category, slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { category, slug } = await params
  const post = getPost(category, slug)
  if (!post) return { title: "Not Found" }
  return {
    title: `${post.title} — Ashish Singhal`,
    description: post.summary,
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { category, slug } = await params
  const post = getPost(category, slug)
  if (!post) notFound()

  const allPosts = getAllPosts()
  const currentIndex = allPosts.findIndex(
    (p) => p.category === category && p.slug === slug
  )
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border">
        <nav className="flex items-center justify-between px-6 md:px-12 lg:px-24 h-16">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">All Insights</span>
          </Link>
          <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
            {post.category}
          </span>
        </nav>
      </header>

      <article className="px-6 md:px-12 lg:px-24 pt-20 pb-32">
        {/* Article header */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex items-center gap-4 mb-8">
            <span className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
              {post.category}
            </span>
            <span className="h-px w-4 bg-border" />
            <span className="font-mono text-[11px] text-muted-foreground">
              {formatDate(post.date)}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-foreground leading-[1.05] text-balance">
            {post.title}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mt-6 max-w-lg">
            {post.summary}
          </p>
          <div className="h-px w-full bg-border mt-12" />
        </div>

        {/* Article body */}
        <div className="max-w-4xl mx-auto">
          <MarkdownRenderer content={post.content} />
        </div>

        {/* Navigation */}
        <div className="max-w-4xl mx-auto mt-24 pt-12 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {prevPost && (
              <Link
                href={`/insights/${prevPost.category}/${prevPost.slug}`}
                className="group p-6 border border-border hover:border-muted-foreground transition-all duration-300"
              >
                <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                  Previous
                </span>
                <p className="text-sm font-semibold text-foreground mt-2 tracking-tight group-hover:text-foreground/80 transition-colors">
                  {prevPost.title}
                </p>
              </Link>
            )}
            {nextPost && (
              <Link
                href={`/insights/${nextPost.category}/${nextPost.slug}`}
                className="group p-6 border border-border hover:border-muted-foreground transition-all duration-300 md:text-right md:col-start-2"
              >
                <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                  Next
                </span>
                <p className="text-sm font-semibold text-foreground mt-2 tracking-tight group-hover:text-foreground/80 transition-colors">
                  {nextPost.title}
                </p>
              </Link>
            )}
          </div>
        </div>
      </article>

      <footer className="px-6 md:px-12 lg:px-24 py-8 border-t border-border">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs text-muted-foreground">
            {"© 2026 — Ashish Singhal"}
          </p>
          <Link
            href="/"
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Portfolio
          </Link>
        </div>
      </footer>
    </div>
  )
}
