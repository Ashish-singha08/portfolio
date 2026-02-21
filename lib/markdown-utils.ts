export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export interface TocHeading {
  id: string
  text: string
  level: 2 | 3
}

export function extractHeadings(md: string): TocHeading[] {
  const headings: TocHeading[] = []
  const lines = md.split("\n")
  for (const line of lines) {
    if (line.startsWith("### ")) {
      const text = line.slice(4).trim()
      headings.push({ id: slugify(text), text, level: 3 })
    } else if (line.startsWith("## ")) {
      const text = line.slice(3).trim()
      headings.push({ id: slugify(text), text, level: 2 })
    }
  }
  return headings
}
