import fs from "fs"
import path from "path"

export interface PostMeta {
  title: string
  summary: string
  date: string
  slug: string
  category: string
}

export interface Post extends PostMeta {
  content: string
}

const CONTENT_DIR = path.join(process.cwd(), "content")

function parseFrontmatter(raw: string): {
  data: Record<string, string>
  content: string
} {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }

  const data: Record<string, string> = {}
  match[1].split("\n").forEach((line) => {
    const idx = line.indexOf(":")
    if (idx !== -1) {
      const key = line.slice(0, idx).trim()
      let value = line.slice(idx + 1).trim()
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1)
      }
      data[key] = value
    }
  })

  return { data, content: match[2].trim() }
}

export function getCategories(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return []
  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()
}

export function getAllPosts(): PostMeta[] {
  const categories = getCategories()
  const posts: PostMeta[] = []

  for (const category of categories) {
    const categoryDir = path.join(CONTENT_DIR, category)
    const files = fs
      .readdirSync(categoryDir)
      .filter((f) => f.endsWith(".md"))

    for (const file of files) {
      const raw = fs.readFileSync(path.join(categoryDir, file), "utf-8")
      const { data } = parseFrontmatter(raw)
      posts.push({
        title: data.title || file.replace(".md", ""),
        summary: data.summary || "",
        date: data.date || "",
        slug: file.replace(".md", ""),
        category,
      })
    }
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter((p) => p.category === category)
}

export function getPost(category: string, slug: string): Post | null {
  const filePath = path.join(CONTENT_DIR, category, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, "utf-8")
  const { data, content } = parseFrontmatter(raw)

  return {
    title: data.title || slug,
    summary: data.summary || "",
    date: data.date || "",
    slug,
    category,
    content,
  }
}
