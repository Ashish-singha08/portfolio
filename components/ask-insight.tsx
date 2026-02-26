"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles, Search } from "lucide-react"

interface Source {
  title: string
  url: string
  category: string
}

type Phase = "idle" | "thinking" | "answering"

export function AskInsight() {
  const [question, setQuestion] = useState("")
  const [submittedQuestion, setSubmittedQuestion] = useState("")
  const [phase, setPhase] = useState<Phase>("idle")
  const [answer, setAnswer] = useState("")
  const [sources, setSources] = useState<Source[]>([])
  const [displayedAnswer, setDisplayedAnswer] = useState("")
  const [questionsUsed, setQuestionsUsed] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const questionsRemaining = 5 - questionsUsed
  const hasReachedLimit = questionsRemaining <= 0

  // Typewriter effect
  useEffect(() => {
    if (phase !== "answering" || !answer) return

    let i = 0
    let timeout: NodeJS.Timeout

    const typeNext = () => {
      if (i < answer.length) {
        setDisplayedAnswer(answer.slice(0, i + 1))
        i++
        const char = answer[i - 1]
        const delay = ['.', '!', '?'].includes(char) ? 100 : [',', '—', ':'].includes(char) ? 60 : 18
        timeout = setTimeout(typeNext, delay)
      }
    }

    timeout = setTimeout(typeNext, 400)
    return () => clearTimeout(timeout)
  }, [phase, answer])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim() || phase !== "idle" || hasReachedLimit) return

    const q = question.trim()
    setSubmittedQuestion(q)
    setQuestion("")
    setPhase("thinking")
    setAnswer("")
    setSources([])
    setDisplayedAnswer("")

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      })

      const data = await res.json()
      setAnswer(data.answer || "I couldn't find an answer to that.")
      setSources(data.sources || [])
      setQuestionsUsed(prev => prev + 1)
      setPhase("answering")
    } catch {
      setAnswer("Something went wrong. Please try again.")
      setSources([])
      setPhase("answering")
    }
  }

  function handleReset() {
    setPhase("idle")
    setAnswer("")
    setSources([])
    setDisplayedAnswer("")
    setSubmittedQuestion("")
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const isTypingComplete = displayedAnswer.length === answer.length

  return (
    <section className="mb-20 mt-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Main Container */}
        <div 
          className={`
            relative border-2 transition-all duration-500
            ${isFocused || phase === 'thinking' 
              ? 'border-foreground bg-secondary/50' 
              : 'border-border bg-card/50'
            }
          `}
        >
          {/* Top accent line when active */}
          <motion.div
            className="absolute top-0 left-0 h-1 bg-foreground"
            initial={{ width: 0 }}
            animate={{ 
              width: isFocused || phase === 'thinking' ? '100%' : '0%' 
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />

          <div className="p-6 md:p-10">
            
            <AnimatePresence mode="wait">
              {/* === IDLE STATE === */}
              {phase === "idle" && !hasReachedLimit && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="p-3 border border-border bg-background">
                        <Sparkles className="h-5 w-5 text-foreground" />
                      </div>
                      <div>
                        <h3 className="font-display text-base font-semibold text-foreground tracking-tight">
                          Ask my knowledge base
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          RAG-powered search across all my writings
                        </p>
                      </div>
                    </div>
                    
                    {/* Question counter */}
                    <div className="hidden md:flex items-center gap-3">
                      <span className="font-mono text-xs text-muted-foreground">
                        {questionsRemaining} left
                      </span>
                      <div className="flex gap-1.5">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 w-2 rounded-full transition-colors ${
                              i < questionsRemaining 
                                ? 'bg-foreground' 
                                : 'bg-border'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleSubmit}>
                    <div className="relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="What would you like to understand?"
                        className="w-full bg-background border-2 border-border text-foreground text-xl md:text-2xl font-serif placeholder:text-muted-foreground focus:outline-none focus:border-foreground px-6 py-5 transition-colors"
                        autoComplete="off"
                        spellCheck="false"
                      />
                      
                      {/* Submit button inside input */}
                      <button
                        type="submit"
                        disabled={!question.trim()}
                        className={`
                          absolute right-3 top-1/2 -translate-y-1/2
                          p-3 transition-all duration-300
                          ${question.trim() 
                            ? 'bg-foreground text-background hover:bg-foreground/90' 
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                          }
                        `}
                      >
                        <Search className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Helper text */}
                    <p className="mt-4 text-sm text-muted-foreground">
                      Try: "How do I choose chunk size for RAG?" or "What are embedding models?"
                    </p>
                  </form>
                </motion.div>
              )}

              {/* === THINKING STATE === */}
              {phase === "thinking" && (
                <motion.div
                  key="thinking"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="py-8"
                >
                  {/* Question */}
                  <p className="font-serif text-xl md:text-2xl text-muted-foreground mb-10">
                    "{submittedQuestion}"
                  </p>
                  
                  {/* Loading animation */}
                  <div className="flex items-center gap-6">
                    <div className="flex gap-2">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <motion.div
                          key={i}
                          className="h-2 w-10 bg-foreground origin-left"
                          animate={{
                            scaleX: [0.3, 1, 0.3],
                            opacity: [0.3, 1, 0.3],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.12,
                            ease: "easeInOut"
                          }}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-sm tracking-wider uppercase text-muted-foreground">
                      Searching
                    </span>
                  </div>
                </motion.div>
              )}

              {/* === ANSWER STATE === */}
              {phase === "answering" && (
                <motion.div
                  key="answering"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Question label */}
                  <div className="mb-6 pb-4 border-b border-border">
                    <p className="font-mono text-xs tracking-wider uppercase text-muted-foreground mb-2">
                      Your question
                    </p>
                    <p className="font-serif text-lg text-muted-foreground">
                      {submittedQuestion}
                    </p>
                  </div>

                  {/* Answer */}
                  <div className="mb-8">
                    <p className="font-serif text-xl md:text-2xl text-foreground leading-relaxed">
                      {displayedAnswer}
                      {!isTypingComplete && (
                        <motion.span 
                          className="inline-block w-0.5 h-6 bg-foreground ml-1 align-middle"
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                        />
                      )}
                    </p>
                  </div>

                  {/* Sources */}
                  <AnimatePresence>
                    {sources.length > 0 && isTypingComplete && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-10 pt-6 border-t border-border"
                      >
                        <p className="font-mono text-xs tracking-wider uppercase text-muted-foreground mb-4">
                          Related articles
                        </p>
                        
                        <div className="space-y-2">
                          {sources.map((source, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * i }}
                            >
                              <Link
                                href={source.url}
                                className="group flex items-center justify-between py-3 px-4 -mx-4 bg-background hover:bg-secondary border border-transparent hover:border-border transition-all duration-300"
                              >
                                <div className="flex items-center gap-4">
                                  <span className="font-mono text-xs tracking-wider uppercase text-muted-foreground w-14">
                                    {source.category}
                                  </span>
                                  <span className="font-serif text-foreground group-hover:underline">
                                    {source.title}
                                  </span>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300" />
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Actions */}
                  {isTypingComplete && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-10 pt-6 border-t border-border flex items-center justify-between"
                    >
                      {!hasReachedLimit ? (
                        <button
                          onClick={handleReset}
                          className="group inline-flex items-center gap-3 font-display text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
                        >
                          <span>Ask another question</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                      ) : (
                        <p className="font-serif text-sm text-muted-foreground italic">
                          You've explored all questions for this session
                        </p>
                      )}
                      
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-muted-foreground">
                          {questionsRemaining} left
                        </span>
                        <div className="flex gap-1.5">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 w-2 rounded-full ${
                                i < questionsRemaining 
                                  ? 'bg-foreground' 
                                  : 'bg-border'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* === LIMIT REACHED === */}
              {hasReachedLimit && phase === "idle" && (
                <motion.div
                  key="limit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 text-center"
                >
                  <div className="inline-block p-4 border border-border bg-background mb-6">
                    <Sparkles className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="font-serif text-xl text-foreground mb-2">
                    You've explored all five questions
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Browse the writings below or return later with fresh curiosity
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
