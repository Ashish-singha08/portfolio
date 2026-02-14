import Link from "next/link"

export function Footer() {
  return (
    <footer className="px-6 md:px-12 lg:px-24 py-8 border-t border-border">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="font-mono text-xs text-muted-foreground">
          {"© 2026 Ashish Singhal — Noida, India"}
        </p>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/Ashish-singha08"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/ashish-singhal-078815140/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            LinkedIn
          </a>
          <Link
            href="/insights"
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Insights
          </Link>
        </div>
      </div>
    </footer>
  )
}
