"use client"

import React, { useState, useCallback } from "react"
import { Check, Copy } from "lucide-react"

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  const lines = code.split("\n")
  // Remove trailing empty line if present
  if (lines[lines.length - 1]?.trim() === "") lines.pop()

  return (
    <div className="notion-code-block group">
      {/* Top bar */}
      <div className="notion-code-header">
        <span className="notion-code-lang">{lang || "plain"}</span>
        <button
          onClick={handleCopy}
          className="notion-code-copy"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code body with line numbers */}
      <div className="notion-code-body">
        <table className="notion-code-table">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="notion-code-row">
                <td className="notion-code-line-num">{i + 1}</td>
                <td
                  className="notion-code-line"
                  dangerouslySetInnerHTML={{
                    __html: highlightSyntax(line, lang),
                  }}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* Minimal syntax highlighter (no external deps) */
function highlightSyntax(line: string, lang: string): string {
  let escaped = line
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

  if (!lang || lang === "plain" || lang === "text") return escaped

  // Strings (double and single quoted)
  escaped = escaped.replace(
    /(&quot;|")(.*?)(\1)|('.*?')/g,
    '<span class="syn-str">$&</span>'
  )
  

  // Comments (python # and // style)
  escaped = escaped.replace(
    /(#[^&].*$)|(\/\/.*$)/gm,
    '<span class="syn-comment">$&</span>'
  )

  // Keywords
  const pyKw =
    /\b(def|class|import|from|return|if|elif|else|for|while|try|except|finally|with|as|yield|async|await|raise|pass|break|continue|and|or|not|in|is|None|True|False|self|lambda)\b/g
  const jsKw =
    /\b(const|let|var|function|return|if|else|for|while|try|catch|finally|class|import|export|from|default|async|await|new|this|typeof|instanceof|throw|switch|case|break|continue|true|false|null|undefined)\b/g

  if (lang === "python" || lang === "py") {
    escaped = escaped.replace(pyKw, '<span class="syn-kw">$&</span>')
    // Decorators
    escaped = escaped.replace(
      /(@\w+)/g,
      '<span class="syn-decorator">$&</span>'
    )
  } else {
    escaped = escaped.replace(jsKw, '<span class="syn-kw">$&</span>')
  }

  // Numbers
  escaped = escaped.replace(
    /\b(\d+\.?\d*)\b/g,
    '<span class="syn-num">$&</span>'
  )

  // Function calls
  escaped = escaped.replace(
    /\b([a-zA-Z_]\w*)\s*\(/g,
    '<span class="syn-fn">$1</span>('
  )

  return escaped
}

/* ---------- Markdown parser ---------- */

interface ParsedBlock {
  type:
    | "code"
    | "h1"
    | "h2"
    | "h3"
    | "p"
    | "ul"
    | "ol"
    | "blockquote"
    | "hr"
    | "table"
  lang?: string
  content: string
  items?: string[]
  headers?: string[]
  rows?: string[][]
}

function parseMarkdownToBlocks(md: string): ParsedBlock[] {
  const blocks: ParsedBlock[] = []
  const lines = md.split("\n")
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Code blocks
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i])
        i++
      }
      blocks.push({ type: "code", lang, content: codeLines.join("\n") })
      i++
      continue
    }

    // Tables
    if (line.includes("|") && lines[i + 1]?.match(/^\|[-| :]+\|$/)) {
      const headers = line
        .split("|")
        .map((h) => h.trim())
        .filter(Boolean)
      i += 2 // skip header and separator
      const rows: string[][] = []
      while (i < lines.length && lines[i].includes("|")) {
        rows.push(
          lines[i]
            .split("|")
            .map((c) => c.trim())
            .filter(Boolean)
        )
        i++
      }
      blocks.push({ type: "table", content: "", headers, rows })
      continue
    }

    // Horizontal rules
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      blocks.push({ type: "hr", content: "" })
      i++
      continue
    }

    // Headers
    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", content: line.slice(4) })
      i++
      continue
    }
    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", content: line.slice(3) })
      i++
      continue
    }
    if (line.startsWith("# ")) {
      blocks.push({ type: "h1", content: line.slice(2) })
      i++
      continue
    }

    // Blockquotes
    if (line.startsWith("> ")) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2))
        i++
      }
      blocks.push({ type: "blockquote", content: quoteLines.join("\n") })
      continue
    }

    // Unordered lists
    if (line.match(/^[-*] /)) {
      const items: string[] = []
      while (i < lines.length && lines[i].match(/^[-*] /)) {
        items.push(lines[i].replace(/^[-*] /, ""))
        i++
      }
      blocks.push({ type: "ul", content: "", items })
      continue
    }

    // Ordered lists
    if (line.match(/^\d+\. /)) {
      const items: string[] = []
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        items.push(lines[i].replace(/^\d+\. /, ""))
        i++
      }
      blocks.push({ type: "ol", content: "", items })
      continue
    }

    // Empty lines
    if (line.trim() === "") {
      i++
      continue
    }

    // Paragraphs
    blocks.push({ type: "p", content: line })
    i++
  }

  return blocks
}

function inlineFormat(text: string): string {
  return text
    // Images FIRST
    .replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="notion-image" />'
    )

    // Then normal formatting
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, '<code class="notion-inline-code">$1</code>')

    // Links AFTER images
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="notion-link" target="_blank" rel="noopener noreferrer">$1</a>'
    )
}


export function MarkdownRenderer({ content }: { content: string }) {
  const blocks = parseMarkdownToBlocks(content)

  return (
    <div className="notion-prose">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "code":
            return <CodeBlock key={i} lang={block.lang || ""} code={block.content} />

          case "h1":
            return (
              <h1
                key={i}
                className="notion-h1"
                dangerouslySetInnerHTML={{ __html: inlineFormat(block.content) }}
              />
            )
          case "h2":
            return (
              <h2
                key={i}
                className="notion-h2"
                dangerouslySetInnerHTML={{ __html: inlineFormat(block.content) }}
              />
            )
          case "h3":
            return (
              <h3
                key={i}
                className="notion-h3"
                dangerouslySetInnerHTML={{ __html: inlineFormat(block.content) }}
              />
            )

          case "p":
            return (
              <p
                key={i}
                className="notion-p"
                dangerouslySetInnerHTML={{ __html: inlineFormat(block.content) }}
              />
            )

          case "blockquote":
            return (
              <blockquote
                key={i}
                className="notion-callout"
                dangerouslySetInnerHTML={{
                  __html: inlineFormat(block.content),
                }}
              />
            )

          case "ul":
            return (
              <ul key={i} className="notion-ul">
                {block.items?.map((item, j) => (
                  <li
                    key={j}
                    className="notion-li"
                    dangerouslySetInnerHTML={{ __html: inlineFormat(item) }}
                  />
                ))}
              </ul>
            )

          case "ol":
            return (
              <ol key={i} className="notion-ol">
                {block.items?.map((item, j) => (
                  <li
                    key={j}
                    className="notion-li-ordered"
                    dangerouslySetInnerHTML={{ __html: inlineFormat(item) }}
                  />
                ))}
              </ol>
            )

          case "hr":
            return <hr key={i} className="notion-hr" />

          case "table":
            return (
              <div key={i} className="notion-table-wrap">
                <table className="notion-table">
                  <thead>
                    <tr>
                      {block.headers?.map((h, j) => (
                        <th
                          key={j}
                          className="notion-th"
                          dangerouslySetInnerHTML={{ __html: inlineFormat(h) }}
                        />
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows?.map((row, j) => (
                      <tr key={j}>
                        {row.map((cell, k) => (
                          <td
                            key={k}
                            className="notion-td"
                            dangerouslySetInnerHTML={{
                              __html: inlineFormat(cell),
                            }}
                          />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )

          default:
            return null
        }
      })}
    </div>
  )
}
