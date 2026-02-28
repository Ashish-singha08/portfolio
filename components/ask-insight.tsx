"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowUpRight, CornerDownLeft } from "lucide-react"
import { HowItWorksTrigger } from "@/components/how-it-works-modal"

interface Source {
  title: string
  url: string
  category: string
}

type Phase = "idle" | "thinking" | "answering"

const SUGGESTIONS = [
  "How do I choose chunk size?",
  "What are embeddings?",
  "RAG vs fine-tuning?",
  "When to use semantic chunking?",
]

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&"

function useScrambleText(target: string, active: boolean) {
  const [output, setOutput] = useState("")
  const frameRef = useRef<number>(0)
  const iterRef = useRef(0)

  useEffect(() => {
    if (!active || !target) return
    iterRef.current = 0
    const totalFrames = target.length * 2.5

    const tick = () => {
      iterRef.current++
      const progress = iterRef.current / totalFrames
      const resolved = Math.floor(progress * target.length)
      setOutput(
        target.split("").map((char, i) => {
          if (char === " ") return " "
          if (i < resolved) return char
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        }).join("")
      )
      if (resolved < target.length) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        setOutput(target)
      }
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(frameRef.current) }
  }, [target, active])

  return output
}

function useTypewriter(text: string, active: boolean) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!active || !text) return
    setDisplayed("")
    setDone(false)
    let i = 0
    let timeout: NodeJS.Timeout
    const type = () => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
        const c = text[i - 1]
        const delay = ['.', '!', '?'].includes(c) ? 80 : [',', ';', ':'].includes(c) ? 45 : 14
        timeout = setTimeout(type, delay)
      } else {
        setDone(true)
      }
    }
    timeout = setTimeout(type, 200)
    return () => clearTimeout(timeout)
  }, [text, active])

  return { displayed, done }
}

export function AskInsight() {
  const [question, setQuestion] = useState("")
  const [submittedQ, setSubmittedQ] = useState("")
  const [phase, setPhase] = useState<Phase>("idle")
  const [answer, setAnswer] = useState("")
  const [sources, setSources] = useState<Source[]>([])
  const [questionsUsed, setQuestionsUsed] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const remaining = 5 - questionsUsed
  const atLimit = remaining <= 0
  const isAnswering = phase === "answering"

  const { displayed, done: typeDone } = useTypewriter(answer, isAnswering)
  const scrambledQ = useScrambleText(submittedQ, phase === "thinking")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim() || phase !== "idle" || atLimit) return

    const q = question.trim()
    setSubmittedQ(q)
    setQuestion("")
    setPhase("thinking")
    setAnswer("")
    setSources([])

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      })
      const data = await res.json()
      setAnswer(data.answer || "I couldn't find an answer to that.")
      setSources(data.sources || [])
      setQuestionsUsed(p => p + 1)
      setPhase("answering")
    } catch {
      setAnswer("Something went wrong. Please try again.")
      setSources([])
      setPhase("answering")
    }
  }

  function reset() {
    setPhase("idle")
    setAnswer("")
    setSources([])
    setSubmittedQ("")
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  return (
    <section className="mb-20 mt-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative border border-border bg-background overflow-hidden">

          {/* Amber top accent */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, #F59E0B, #FBBF24, transparent)" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          />

          {/* Corner ticks */}
          {[
            "top-0 left-0 border-t border-l",
            "top-0 right-0 border-t border-r",
            "bottom-0 left-0 border-b border-l",
            "bottom-0 right-0 border-b border-r",
          ].map((cls, i) => (
            <div key={i} className={`absolute w-3 h-3 ${cls} border-amber-500/40 pointer-events-none`} />
          ))}

          <AnimatePresence mode="wait">

            {/* ── IDLE ── */}
            {phase === "idle" && !atLimit && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="p-8 md:p-12"
              >
                {/* Header row */}
                <motion.div
                  className="flex items-center justify-between mb-10"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="h-1.5 w-1.5 rounded-full bg-amber-500"
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                      Knowledge Search
                    </span>
                    <span className="text-muted-foreground/30 text-xs">—</span>
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                      RAG-Powered
                    </span>
                  </div>

                  {/* Counter */}
                  <div className="hidden md:flex items-center gap-3">
                    <div className="flex gap-1.5">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className={`h-1 w-5 transition-colors duration-700 ${
                            i < remaining ? "bg-amber-500" : "bg-border"
                          }`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.2 + i * 0.06, duration: 0.4 }}
                          style={{ transformOrigin: "left" }}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground tracking-wider">
                      {remaining}/5
                    </span>
                  </div>
                </motion.div>

                {/* Input */}
                <form onSubmit={handleSubmit}>
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={question}
                      onChange={e => setQuestion(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="What would you like to understand?"
                      className="w-full bg-transparent text-foreground font-display text-2xl md:text-3xl placeholder:text-muted-foreground/30 focus:outline-none py-4 pr-20 border-b border-border"
                      autoComplete="off"
                      spellCheck="false"
                    />

                    {/* Focus underline */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-px bg-amber-500"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isFocused ? 1 : 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      style={{ transformOrigin: "left" }}
                    />

                    {/* Submit */}
                    <AnimatePresence>
                      {question.trim() && (
                        <motion.button
                          type="submit"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute right-0 bottom-3 flex items-center justify-center h-8 w-8 bg-amber-500"
                        >
                          <CornerDownLeft className="h-3.5 w-3.5 text-black" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Suggestions + how it works */}
                  <motion.div
                    className="mt-7 flex flex-wrap gap-2 items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground/40 mr-2">
                      Try
                    </span>
                    {SUGGESTIONS.map((s, i) => (
                      <motion.button
                        key={s}
                        type="button"
                        onClick={() => { setQuestion(s); inputRef.current?.focus() }}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 + i * 0.07 }}
                        className="font-mono text-[10px] tracking-wide px-3 py-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all duration-200"
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {s}
                      </motion.button>
                    ))}

                    <div className="ml-auto">
                      <HowItWorksTrigger />
                    </div>
                  </motion.div>
                </form>
              </motion.div>
            )}

            {/* ── THINKING ── */}
            {phase === "thinking" && (
              <motion.div
                key="thinking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="p-8 md:p-12 min-h-[220px] flex flex-col justify-center"
              >
                <motion.p
                  className="font-mono text-sm md:text-base mb-10 tracking-wide text-amber-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  &gt; {scrambledQ || submittedQ}_
                </motion.p>

                <div className="flex items-end gap-[3px]" style={{ height: 28 }}>
                  {[0.3, 0.7, 1, 0.6, 0.4, 0.9, 0.5, 0.8, 0.35, 0.65].map((h, i) => (
                    <motion.div
                      key={i}
                      className="w-[3px] bg-amber-500"
                      animate={{
                        scaleY: [h * 0.2, h, h * 0.35, h * 0.75, h * 0.2],
                        opacity: [0.3, 1, 0.5, 0.85, 0.3],
                      }}
                      transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.08, ease: "easeInOut" }}
                      style={{ height: "100%", transformOrigin: "bottom" }}
                    />
                  ))}
                </div>

                <motion.p
                  className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-4"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Searching knowledge base...
                </motion.p>
              </motion.div>
            )}

            {/* ── ANSWER ── */}
            {phase === "answering" && (
              <motion.div
                key="answering"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="p-8 md:p-12"
              >
                {/* Question recap */}
                <motion.div
                  className="mb-8 pb-6 border-b border-border"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-amber-500/60 mb-2">
                    &gt; query
                  </p>
                  <p className="font-mono text-sm text-amber-500/80">{submittedQ}</p>
                </motion.div>

                {/* Answer */}
                <div className="mb-10">
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
                    &gt; response
                  </p>
                  <p className="font-serif text-lg md:text-xl text-foreground leading-[1.9]">
                    {displayed}
                    {!typeDone && (
                      <motion.span
                        className="inline-block w-0.5 h-[1.1em] bg-amber-500 ml-0.5 align-middle"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.4, repeat: Infinity }}
                      />
                    )}
                  </p>
                </div>

                {/* Sources */}
                <AnimatePresence>
                  {sources.length > 0 && typeDone && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="mb-8 pb-8 border-b border-border"
                    >
                      <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
                        &gt; sources
                      </p>
                      {sources.map((s, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.08 * i }}
                        >
                          <Link
                            href={s.url}
                            className="group flex items-center justify-between py-4 border-b border-border/40 last:border-0"
                          >
                            <div className="flex items-center gap-4">
                              <span className="font-mono text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 text-amber-500 bg-amber-500/08 border border-amber-500/20">
                                {s.category}
                              </span>
                              <span className="font-serif text-foreground group-hover:text-muted-foreground transition-colors duration-200">
                                {s.title}
                              </span>
                            </div>
                            <motion.div whileHover={{ x: 2, y: -2 }}>
                              <ArrowUpRight className="h-3.5 w-3.5 ml-4 shrink-0 text-muted-foreground/30 group-hover:text-amber-500 transition-colors duration-200" />
                            </motion.div>
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Footer */}
                {typeDone && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-6">
                      {!atLimit ? (
                        <motion.button
                          onClick={reset}
                          className="group flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-amber-500 transition-colors duration-200"
                          whileHover={{ x: 3 }}
                        >
                          <span>Ask another</span>
                          <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                      ) : (
                        <p className="font-serif text-sm text-muted-foreground italic">
                          You've explored all five questions for this session.
                        </p>
                      )}
                      <HowItWorksTrigger />
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            className={`h-1 w-5 transition-colors duration-700 ${
                              i < remaining ? "bg-amber-500" : "bg-border"
                            }`}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: i * 0.05 }}
                            style={{ transformOrigin: "left" }}
                          />
                        ))}
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground tracking-wider">
                        {remaining}/5
                      </span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ── LIMIT ── */}
            {atLimit && phase === "idle" && (
              <motion.div
                key="limit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 md:p-12 min-h-[160px] flex flex-col justify-center"
              >
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-amber-500 mb-3">
                  &gt; session complete
                </p>
                <p className="font-display text-xl text-foreground mb-2">
                  You've explored all five questions.
                </p>
                <p className="font-serif text-sm text-muted-foreground">
                  Browse the writings below, or return with fresh curiosity.
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  )
}