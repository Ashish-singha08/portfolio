import React from "react"

function parseMarkdown(md: string): string {
  let html = md
    // Code blocks
    .replace(
      /```(\w+)?\n([\s\S]*?)```/g,
      (_match, lang, code) =>
        `<pre class="code-block" data-lang="${lang || ""}"><code>${code
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}</code></pre>`
    )
    // Inline code
    .replace(
      /`([^`]+)`/g,
      '<code class="inline-code">$1</code>'
    )
    // Tables
    .replace(
      /\|(.+)\|\n\|[-| ]+\|\n((?:\|.+\|\n?)*)/g,
      (_match, header, body) => {
        const headers = header
          .split("|")
          .map((h: string) => h.trim())
          .filter(Boolean)
        const rows = body
          .trim()
          .split("\n")
          .map((row: string) =>
            row
              .split("|")
              .map((c: string) => c.trim())
              .filter(Boolean)
          )
        return `<div class="table-wrap"><table><thead><tr>${headers
          .map((h: string) => `<th>${h}</th>`)
          .join("")}</tr></thead><tbody>${rows
          .map(
            (row: string[]) =>
              `<tr>${row.map((c: string) => `<td>${c}</td>`).join("")}</tr>`
          )
          .join("")}</tbody></table></div>`
      }
    )
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>')
    // Bold and italic
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li class="md-li">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="md-li-ordered">$1</li>')
    // Paragraphs
    .replace(/^(?!<[huplitd]|<pre|<div|<li|<code)(.+)$/gm, "<p>$1</p>")
    // Wrap list items
    .replace(
      /(<li class="md-li">[\s\S]*?<\/li>)/g,
      (m) => (m.includes("md-li-ordered") ? m : m)
    )

  return html
}

export function MarkdownRenderer({ content }: { content: string }) {
  const html = parseMarkdown(content)
  return (
    <div
      className="prose-custom"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
