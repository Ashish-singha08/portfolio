"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { X, Zap, Database, Search, Brain, ArrowRight, ExternalLink } from "lucide-react"
import Link from "next/link"

interface HowItWorksModalProps {
  open: boolean
  onClose: () => void
}

const PIPELINE = [
  {
    id: "query",
    step: "01",
    label: "User Query",
    tech: "Next.js API Route",
    icon: Search,
    description:
      "Your question arrives at the serverless API route at /api/ask — no separate backend, no cold starts. Everything lives inside the Next.js project deployed on Vercel.",
    code: `POST /api/ask
{ "question": "How do I choose chunk size?" }`,
  },
  {
    id: "embed",
    step: "02",
    label: "Vectorize Question",
    tech: "Gemini text-embedding-004",
    icon: Zap,
    description:
      'The question is converted into a 768-dimensional vector using Google\'s embedding model. This captures semantic meaning — not just keywords. "chunk size" and "how to split text" land near each other in vector space.',
    code: `// Free via Google AI Studio
const embedding = await model.embedContent(question)
// → Float32Array[768]`,
  },
  {
    id: "search",
    step: "03",
    label: "Similarity Search",
    tech: "Cosine similarity · In-memory",
    icon: Database,
    description:
      "Pre-computed embeddings for every article chunk are loaded from a static JSON file baked into the deployment. Cosine similarity scores each chunk against the query vector. Top 3 are retrieved — no vector DB needed.",
    code: `const scored = embeddings.map(chunk => ({
  ...chunk,
  score: cosineSimilarity(queryVec, chunk.embedding)
}))
const top3 = scored
  .sort((a, b) => b.score - a.score)
  .slice(0, 3)`,
  },
  {
    id: "generate",
    step: "04",
    label: "Generate Answer",
    tech: "Groq · Llama 3.1 8B",
    icon: Brain,
    description:
      "The top 3 chunks are injected into a prompt with strict instructions to answer only from context. Groq's inference runs at ~500 tokens/second — fast enough to feel instant. Free tier: 14,400 requests/day.",
    code: `const completion = await groq.chat.completions.create({
  model: "llama-3.1-8b-instant",
  messages: [{
    role: "user",
    content: \`Answer ONLY from this context:
\${top3.map(c => c.chunk).join("\\n---\\n")}

Question: \${question}\`
  }]
})`,
  },
]

const STACK = [
  { label: "Embeddings", value: "Gemini", sub: "Free tier" },
  { label: "Inference", value: "Groq", sub: "Free tier" },
  { label: "Hosting", value: "Vercel", sub: "Free tier" },
  { label: "Vector DB", value: "None", sub: "Static JSON" },
]

const META_STORY = [
  { icon: "📝", text: "Wrote the chunking strategies article" },
  { icon: "📦", text: "Built the Python chunking package" },
  { icon: "🔍", text: "Used it to power this very search" },
]

// ── Pipeline node ─────────────────────────────────────────────────────────────

function PipelineNode({
  node,
  index,
  active,
  onActivate,
}: {
  node: (typeof PIPELINE)[0]
  index: number
  active: boolean
  onActivate: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.4 })
  const Icon = node.icon

  useEffect(() => {
    if (inView) onActivate()
  }, [inView, onActivate])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      {/* Connector */}
      {index < PIPELINE.length - 1 && (
        <div
          className="absolute left-6 top-[4.5rem] bottom-[-1rem] w-px bg-border"
          style={{ zIndex: 0 }}
        >
          <motion.div
            className="absolute top-0 left-0 w-full rounded-full"
            style={{
              height: 40,
              background: "linear-gradient(to bottom, #F59E0B, transparent)",
              opacity: active ? 1 : 0,
            }}
            animate={active ? { y: [0, 60, 0] } : { y: 0 }}
            transition={{ duration: 2, repeat: active ? Infinity : 0, ease: "easeInOut" }}
          />
        </div>
      )}

      {/* Card */}
      <div
        className={`relative flex gap-5 p-5 transition-all duration-500 border ${
          active ? "border-amber-500/30 bg-amber-500/[0.03]" : "border-border bg-card/30"
        }`}
      >
        {/* Icon */}
        <div className="flex flex-col items-center gap-2 shrink-0 z-10">
          <motion.div
            className={`flex items-center justify-center h-12 w-12 border transition-all duration-500 ${
              active ? "border-amber-500/40 bg-amber-500/10" : "border-border bg-muted/50"
            }`}
            animate={active ? { scale: [1, 1.04, 1] } : { scale: 1 }}
            transition={{ duration: 2, repeat: active ? Infinity : 0 }}
          >
            <Icon
              className={`h-4 w-4 transition-colors duration-500 ${
                active ? "text-amber-500" : "text-muted-foreground"
              }`}
            />
          </motion.div>
          <span
            className={`font-mono text-[10px] tracking-widest transition-colors duration-500 ${
              active ? "text-amber-500/70" : "text-muted-foreground/40"
            }`}
          >
            {node.step}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-display font-semibold text-foreground text-base">{node.label}</h3>
            <span
              className={`font-mono text-[9px] tracking-wider shrink-0 px-2 py-0.5 border transition-all duration-500 ${
                active
                  ? "text-amber-500 bg-amber-500/08 border-amber-500/20"
                  : "text-muted-foreground/50 bg-transparent border-border"
              }`}
            >
              {node.tech}
            </span>
          </div>

          <p className="font-serif text-sm leading-relaxed text-muted-foreground mb-4">
            {node.description}
          </p>

          {/* Code block */}
          <div className="border border-border overflow-hidden" style={{ background: "hsl(var(--code-bg))" }}>
            <div
              className="flex items-center gap-2 px-4 py-2 border-b border-border"
              style={{ background: "hsl(var(--code-header))" }}
            >
              <div className="flex gap-1.5">
                {["#FF5F57", "#FFBD2E", "#28C940"].map((c) => (
                  <div key={c} className="h-2.5 w-2.5 rounded-full opacity-70" style={{ background: c }} />
                ))}
              </div>
            </div>
            <pre className="px-4 py-3 text-[11px] leading-relaxed overflow-x-auto font-mono text-amber-500/80">
              <code>{node.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────

export function HowItWorksModal({ open, onClose }: HowItWorksModalProps) {
  const [activeNode, setActiveNode] = useState(0)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handler)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handler)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  const handleActivate = useCallback((i: number) => setActiveNode(i), [])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Panel */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none">
            <motion.div
              className="relative w-full max-w-2xl max-h-[90vh] flex flex-col pointer-events-auto bg-background border border-border"
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Amber top line */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, #F59E0B, #FBBF24, transparent)" }}
              />

              {/* Corner ticks */}
              {[
                "top-0 left-0 border-t border-l",
                "top-0 right-0 border-t border-r",
                "bottom-0 left-0 border-b border-l",
                "bottom-0 right-0 border-b border-r",
              ].map((cls, i) => (
                <div
                  key={i}
                  className={`absolute w-3 h-3 ${cls} border-amber-500/50`}
                />
              ))}

              {/* Header */}
              <div className="flex items-start justify-between p-6 md:p-8 shrink-0 border-b border-border">
                <div className="text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <motion.div
                      className="h-1.5 w-1.5 rounded-full bg-amber-500"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-amber-500/70">
                      System Architecture
                    </span>
                  </div>
                  <h2 className="font-display text-xl md:text-2xl font-bold text-foreground tracking-tight text-left">
                    How this RAG search works
                  </h2>
                  <p className="font-serif text-sm mt-1 text-muted-foreground text-left">
                    Why semantic retrieval beats keyword search — and how it's built.
                  </p>
                </div>

                <motion.button
                  onClick={onClose}
                  className="flex items-center justify-center h-9 w-9 border border-border text-muted-foreground hover:border-amber-500/40 hover:text-amber-500 transition-all duration-200 shrink-0 ml-4"
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>

              {/* Scrollable body */}
              <div className="overflow-y-auto flex-1 p-6 md:p-8 space-y-6 text-left">

                {/* Why not keyword */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-5 border border-border bg-card/40"
                >
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
                    Why not keyword search?
                  </p>
                  <div className="grid gap-3">
                    {[
                      {
                        verdict: "fails",
                        label: "Keyword search",
                        desc: '"chunk size" ≠ "how to split documents" — misses synonyms entirely',
                      },
                      {
                        verdict: "works",
                        label: "Semantic search (RAG)",
                        desc: "Understands meaning, not just words — finds intent across any phrasing",
                      },
                    ].map((row) => (
                      <div key={row.label} className="flex items-start gap-4">
                        <span
                          className={`font-mono text-[9px] tracking-wider px-2 py-1 border shrink-0 mt-0.5 ${
                            row.verdict === "fails"
                              ? "text-red-400/70 bg-red-400/08 border-red-400/20"
                              : "text-emerald-400/70 bg-emerald-400/08 border-emerald-400/20"
                          }`}
                        >
                          {row.verdict === "fails" ? "✗ FAILS" : "✓ WORKS"}
                        </span>
                        <div>
                          <p className="font-mono text-[11px] text-foreground/60">{row.label}</p>
                          <p className="font-serif text-xs mt-0.5 text-muted-foreground">{row.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Pipeline */}
                <div>
                  <motion.p
                    className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    The pipeline — step by step
                  </motion.p>
                  <div className="space-y-3">
                    {PIPELINE.map((node, i) => (
                      <PipelineNode
                        key={node.id}
                        node={node}
                        index={i}
                        active={activeNode === i}
                        onActivate={() => handleActivate(i)}
                      />
                    ))}
                  </div>
                </div>

                {/* Stack */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-5 border border-border bg-card/40"
                >
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
                    Full stack — zero cost
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {STACK.map((item) => (
                      <div
                        key={item.label}
                        className="p-3 border border-amber-500/10 bg-amber-500/[0.03]"
                      >
                        <p className="font-mono text-[9px] tracking-wider text-muted-foreground/60 mb-1">
                          {item.label}
                        </p>
                        <p className="font-display font-semibold text-sm text-amber-500">
                          {item.value}
                        </p>
                        <p className="font-mono text-[9px] text-muted-foreground/40">{item.sub}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Meta story */}
                {/* <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-5 border border-amber-500/20 bg-amber-500/[0.03]"
                >
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-amber-500/60 mb-4">
                    The full story
                  </p>
                  <div className="space-y-3 mb-5">
                    {META_STORY.map((item, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                      >
                        <span className="text-base">{item.icon}</span>
                        <span className="font-serif text-sm text-muted-foreground">{item.text}</span>
                        {i < META_STORY.length - 1 && (
                          <ArrowRight className="h-3 w-3 ml-auto shrink-0 text-amber-500/30" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                  <Link
                    href="/insights/rag/chunking-strategies"
                    onClick={onClose}
                    className="group inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] uppercase text-amber-500/60 hover:text-amber-500 transition-colors duration-200"
                  >
                    <span>Read the chunking strategies article</span>
                    <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                  </Link>
                </motion.div> */}
              </div>

              {/* Footer */}
              <div className="shrink-0 px-6 md:px-8 py-4 flex items-center justify-between border-t border-border">
                <p className="font-mono text-[10px] text-muted-foreground/40">
                  Built entirely on free tiers · No vendor lock-in
                </p>
                <motion.button
                  onClick={onClose}
                  className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground/40 hover:text-amber-500 transition-colors duration-200"
                  whileTap={{ scale: 0.97 }}
                >
                  Close esc
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

// ── Trigger — drop anywhere ───────────────────────────────────────────────────

export function HowItWorksTrigger({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className={`group inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-amber-500 transition-colors duration-200 ${className ?? ""}`}
        whileTap={{ scale: 0.97 }}
      >
        <motion.div
          className="h-1 w-1 rounded-full bg-current"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span>How this works</span>
      </motion.button>

      <HowItWorksModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}