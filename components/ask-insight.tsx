"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"

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
    <section className="mb-16 mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Main Container - clean with accent color */}
        <div className="relative bg-card">
          {/* Accent gradient top bar */}
          <div className="h-1 w-full bg-gradient-to-r from-[hsl(210,55%,55%)] via-[hsl(150,45%,45%)] to-[hsl(35,75%,48%)]" />
          
          <div className="p-6 md:p-10 border-x border-b border-border">
            
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
                      {/* Animated AI icon */}
                      <motion.div 
                        className="relative p-3 bg-[hsl(210,55%,55%,0.1)] rounded-lg"
                        animate={isFocused ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Sparkles className="h-5 w-5 text-[hsl(210,55%,55%)]" />
                        {/* Glow effect */}
                        <motion.div
                          className="absolute inset-0 rounded-lg bg-[hsl(210,55%,55%,0.2)]"
                          animate={{ opacity: isFocused ? [0.3, 0.6, 0.3] : 0 }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.div>
                      <div>
                        <h3 className="font-display text-lg font-semibold text-foreground tracking-tight">
                          Ask anything
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          RAG-powered search across all my writings
                        </p>
                      </div>
                    </div>
                    
                    {/* Question counter - pill style */}
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            className={`h-1.5 w-1.5 rounded-full ${
                              i < questionsRemaining 
                                ? 'bg-[hsl(150,45%,45%)]' 
                                : 'bg-muted'
                            }`}
                            initial={false}
                            animate={{ scale: i === questionsRemaining - 1 ? [1, 1.3, 1] : 1 }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        ))}
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground tracking-wider">
                        {questionsRemaining} LEFT
                      </span>
                    </div>
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleSubmit}>
                    <div className="relative group">
                      <input
                        ref={inputRef}
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="What would you like to understand?"
                        className="w-full bg-background text-foreground text-lg md:text-xl font-serif placeholder:text-muted-foreground/60 focus:outline-none px-5 py-4 pr-14 border border-border focus:border-[hsl(210,55%,55%)] transition-colors rounded-lg"
                        autoComplete="off"
                        spellCheck="false"
                      />
                      
                      {/* Submit button */}
                      <motion.button
                        type="submit"
                        disabled={!question.trim()}
                        className={`
                          absolute right-2 top-1/2 -translate-y-1/2
                          p-2.5 rounded-lg transition-all duration-300
                          ${question.trim() 
                            ? 'bg-[hsl(210,55%,55%)] text-white' 
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                          }
                        `}
                        whileHover={question.trim() ? { scale: 1.05 } : {}}
                        whileTap={question.trim() ? { scale: 0.95 } : {}}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.button>
                    </div>

                    {/* Suggestions */}
                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="text-xs text-muted-foreground mr-1">Try:</span>
                      {["How do I choose chunk size?", "What are embeddings?", "RAG vs fine-tuning"].map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => setQuestion(suggestion)}
                          className="text-xs px-2.5 py-1 bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
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
                  <p className="font-serif text-xl md:text-2xl text-muted-foreground mb-8 italic">
                    &ldquo;{submittedQuestion}&rdquo;
                  </p>
                  
                  {/* Loading animation - cool wave effect */}
                  <div className="flex items-center gap-6">
                    <div className="flex gap-1">
                      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                        <motion.div
                          key={i}
                          className="h-8 w-1.5 rounded-full bg-gradient-to-t from-[hsl(210,55%,55%)] to-[hsl(150,45%,45%)]"
                          animate={{
                            scaleY: [0.3, 1, 0.3],
                          }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.08,
                            ease: "easeInOut"
                          }}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
                      Searching knowledge base
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
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-[hsl(210,55%,55%)]" />
                      <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                        Your question
                      </p>
                    </div>
                    <p className="font-serif text-lg text-foreground italic">
                      &ldquo;{submittedQuestion}&rdquo;
                    </p>
                  </div>

                  {/* Answer */}
                  <div className="mb-8">
                    <p className="font-serif text-lg md:text-xl text-foreground leading-relaxed">
                      {displayedAnswer}
                      {!isTypingComplete && (
                        <motion.span 
                          className="inline-block w-0.5 h-5 bg-[hsl(210,55%,55%)] ml-1 align-middle rounded-full"
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
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
                        className="mt-8 pt-6 border-t border-border"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-1.5 w-1.5 rounded-full bg-[hsl(150,45%,45%)]" />
                          <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                            Dive deeper
                          </p>
                        </div>
                        
                        <div className="grid gap-2">
                          {sources.map((source, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * i }}
                            >
                              <Link
                                href={source.url}
                                className="group flex items-center justify-between py-3 px-4 bg-secondary/50 hover:bg-secondary rounded-lg transition-all duration-300"
                              >
                                <div className="flex items-center gap-4">
                                  <span className="font-mono text-[10px] tracking-wider uppercase text-[hsl(210,55%,55%)] bg-[hsl(210,55%,55%,0.1)] px-2 py-0.5 rounded">
                                    {source.category}
                                  </span>
                                  <span className="font-serif text-foreground group-hover:text-[hsl(210,55%,55%)] transition-colors">
                                    {source.title}
                                  </span>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[hsl(210,55%,55%)] group-hover:translate-x-1 transition-all duration-300" />
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
                      className="mt-8 pt-6 border-t border-border flex items-center justify-between"
                    >
                      {!hasReachedLimit ? (
                        <motion.button
                          onClick={handleReset}
                          className="group inline-flex items-center gap-2 text-sm font-medium text-[hsl(210,55%,55%)] hover:text-[hsl(210,55%,65%)] transition-colors"
                          whileHover={{ x: 5 }}
                        >
                          <span>Ask another question</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </motion.button>
                      ) : (
                        <p className="font-serif text-sm text-muted-foreground italic">
                          You've explored all questions for this session
                        </p>
                      )}
                      
                      {/* Counter */}
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1.5 w-1.5 rounded-full ${
                                i < questionsRemaining 
                                  ? 'bg-[hsl(150,45%,45%)]' 
                                  : 'bg-muted'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-mono text-[10px] text-muted-foreground tracking-wider">
                          {questionsRemaining} LEFT
                        </span>
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
                  <motion.div 
                    className="inline-block p-4 bg-[hsl(35,75%,48%,0.1)] rounded-xl mb-6"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="h-8 w-8 text-[hsl(35,75%,48%)]" />
                  </motion.div>
                  <p className="font-serif text-xl text-foreground mb-2">
                    You've explored all five questions
                  </p>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
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
