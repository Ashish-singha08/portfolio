import { Clock, FileText, Calendar, Tag } from "lucide-react"

interface ArticleMetaProps {
  date: string
  category: string
  wordCount: number
  readTime: number
}

export function ArticleMeta({
  date,
  category,
  wordCount,
  readTime,
}: ArticleMetaProps) {
  function formatDate(dateStr: string): string {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const items = [
    { icon: Calendar, label: "Published", value: formatDate(date) },
    { icon: Tag, label: "Category", value: category },
    {
      icon: Clock,
      label: "Read time",
      value: `${readTime} min read`,
    },
    {
      icon: FileText,
      label: "Words",
      value: wordCount.toLocaleString(),
    },
  ]

  return (
    <div className="space-y-5">
      <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
        Article info
      </p>
      {items.map((item) => (
        <div key={item.label} className="flex items-start gap-3">
          <item.icon className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground">
              {item.label}
            </p>
            <p className="text-[13px] text-foreground mt-0.5">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
