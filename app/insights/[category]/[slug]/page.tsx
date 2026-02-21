import Link from "next/link"
import { notFound } from "next/navigation"
import { getPost, getAllPosts } from "@/lib/content"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { extractHeadings } from "@/lib/markdown-utils"
import { InsightsNavbar } from "@/components/insights-navbar"
import { ArticleToc } from "@/components/article-toc"
import { ArticleMeta } from "@/components/article-meta"
import { ReadingPreferences } from "@/components/reading-preferences"
import { ShareButtons } from "@/components/share-buttons"

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
  const prevPost =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null

  const headings = extractHeadings(post.content)
  const wordCount = post.content.split(/\s+/).filter(Boolean).length
  const readTime = Math.max(1, Math.ceil(wordCount / 238))

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
      <InsightsNavbar
        backHref="/insights"
        backLabel="All Insights"
        rightLabel={post.category}
      />

      {/* Article header — full width */}
      <header className="px-6 md:px-12 lg:px-16 xl:px-24 pt-16 pb-12">
        <div className="max-w-3xl mx-auto lg:max-w-none lg:mx-0 lg:pl-[calc(220px+3rem)]">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-8">
              <span className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
                {post.category}
              </span>
              <span className="h-px w-4 bg-border" />
              <span className="font-mono text-[11px] text-muted-foreground">
                {formatDate(post.date)}
              </span>
              <span className="h-px w-4 bg-border" />
              <span className="font-mono text-[11px] text-muted-foreground">
                {readTime} min read
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-[44px] font-bold tracking-tighter text-foreground leading-[1.08] text-balance">
              {post.title}
            </h1>
            <p
              className="font-serif text-lg text-muted-foreground mt-6 max-w-2xl"
              style={{ lineHeight: 1.78 }}
            >
              {post.summary}
            </p>
            <div className="h-px w-full bg-border mt-12" />
          </div>
        </div>
      </header>

      {/* 3-column grid: TOC | Content | Meta */}
      <div className="px-6 md:px-12 lg:px-16 xl:px-24 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_180px] gap-12 items-start">
          {/* Left: Table of Contents — sticky, desktop only */}
          <aside className="hidden lg:block sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto">
            <ArticleToc headings={headings} />
          </aside>

          {/* Center: Article body */}
          <article className="min-w-0" style={{ maxWidth: "var(--reading-max-width)" }}>
            <MarkdownRenderer content={post.content} />

            {/* Share buttons */}
            <div className="mt-16 pt-8 border-t border-border">
              <ShareButtons title={post.title} category={category} slug={slug} />
            </div>

            {/* Prev / Next navigation */}
            <div className="mt-24 pt-12 border-t border-border">
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

          {/* Right: Article Meta — sticky, desktop only */}
          <aside className="hidden lg:block sticky top-24 self-start">
            <ArticleMeta
              date={post.date}
              category={post.category}
              wordCount={wordCount}
              readTime={readTime}
            />
          </aside>
        </div>
      </div>

      <footer className="px-6 md:px-12 lg:px-16 xl:px-24 py-8 border-t border-border">
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

      <ReadingPreferences />
    </div>
  )
}
