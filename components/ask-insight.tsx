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
  const containerRef = useRef<HTMLDivElement>(null)

  const questionsRemaining = 5 - questionsUsed
  const hasReachedLimit = questionsRemaining <= 0

  // Typewriter effect with natural pauses
  useEffect(() => {
    if (phase !== "answering" || !answer) return

    let i = 0
    let timeout: NodeJS.Timeout

    const typeNext = () => {
      if (i < answer.length) {
        setDisplayedAnswer(answer.slice(0, i + 1))
        i++
        const char = answer[i - 1]
        const delay = ['.', '!', '?'].includes(char) ? 120 : [',', '—', ':'].includes(char) ? 80 : char === ' ' ? 30 : 20
        timeout = setTimeout(typeNext, delay)
      }
    }

    timeout = setTimeout(typeNext, 600)
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
    <section ref={containerRef} className="mb-24 mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        {/* The Premium Container */}
        <div className="relative overflow-hidden">
          {/* Animated gradient border */}
          <div className="absolute inset-0 p-px">
            <div 
              className="absolute inset-0 opacity-60"
              style={{
                background: isFocused || phase === 'thinking'
                  ? 'linear-gradient(135deg, hsl(var(--foreground) / 0.4) 0%, transparent 50%, hsl(var(--foreground) / 0.2) 100%)'
                  : 'linear-gradient(135deg, hsl(var(--foreground) / 0.15) 0%, transparent 50%, hsl(var(--foreground) / 0.1) 100%)',
                transition: 'all 0.8s ease'
              }}
            />
          </div>

          {/* Inner container */}
          <div className="relative bg-card/80 backdrop-blur-xl">
            {/* Animated top line */}
            <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-transparent via-foreground/60 to-transparent"
                animate={phase === 'thinking' ? {
                  x: ['-100%', '100%'],
                } : {}}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                style={{ width: '50%' }}
              />
            </div>

            {/* Content */}
            <div className="relative px-8 py-10 md:px-12 md:py-14">
              
              <AnimatePresence mode="wait">
                {/* === IDLE STATE === */}
                {phase === "idle" && !hasReachedLimit && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Label with icon */}
                    <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center gap-4">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ 
                            duration: 4, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="p-3 border border-foreground/10 bg-foreground/[0.03]"
                        >
                          <Sparkles className="h-5 w-5 text-foreground/70" />
                        </motion.div>
                        <div>
                          <h3 className="font-display text-sm font-semibold text-foreground tracking-tight">
                            Ask my knowledge base
                          </h3>
                          <p className="text-xs text-muted-foreground/60 mt-0.5">
                            RAG-powered search across all writings
                          </p>
                        </div>
                      </div>
                      <div className="hidden md:flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            className={`h-1.5 w-1.5 rounded-full ${
                              i < questionsRemaining 
                                ? 'bg-foreground/40' 
                                : 'bg-foreground/10'
                            }`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* The Input — the hero */}
                    <form onSubmit={handleSubmit}>
                      <div className="relative group">
                        {/* Breathing glow effect */}
                        <motion.div
                          className="absolute -inset-4 rounded-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-700"
                          animate={isFocused ? {
                            boxShadow: [
                              '0 0 20px 0px hsl(var(--foreground) / 0.03)',
                              '0 0 40px 0px hsl(var(--foreground) / 0.06)',
                              '0 0 20px 0px hsl(var(--foreground) / 0.03)',
                            ]
                          } : {}}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                        
                        <input
                          ref={inputRef}
                          type="text"
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                          placeholder="What would you like to understand?"
                          className="w-full bg-transparent text-foreground text-2xl md:text-3xl lg:text-4xl font-serif placeholder:text-muted-foreground/25 focus:outline-none leading-tight tracking-tight py-4"
                          autoComplete="off"
                          spellCheck="false"
                        />
                        
                        {/* Animated underline */}
                        <div className="relative h-px bg-foreground/10 overflow-hidden">
                          <motion.div
                            className="absolute inset-y-0 left-0 bg-foreground/50"
                            initial={{ width: '0%' }}
                            animate={{ 
                              width: isFocused ? '100%' : question ? `${Math.min(question.length * 2, 100)}%` : '0%' 
                            }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </div>
                      </div>

                      {/* Submit row */}
                      <div className="flex items-center justify-between mt-10">
                        <p className="hidden md:block text-xs text-muted-foreground/40 max-w-sm leading-relaxed">
                          Ask about embeddings, chunking strategies, RAG pipelines, or any topic from my writings.
                        </p>
                        
                        <motion.button
                          type="submit"
                          disabled={!question.trim()}
                          className={`
                            group/btn inline-flex items-center gap-3 font-display text-sm font-medium tracking-tight
                            px-8 py-4 transition-all duration-500 relative overflow-hidden
                            ${question.trim() 
                              ? 'bg-foreground text-background hover:bg-foreground/90' 
                              : 'bg-foreground/5 text-muted-foreground/30 cursor-not-allowed'
                            }
                          `}
                          whileHover={question.trim() ? { scale: 1.02 } : {}}
                          whileTap={question.trim() ? { scale: 0.98 } : {}}
                        >
                          <span>Ask</span>
                          <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${question.trim() ? 'group-hover/btn:translate-x-1' : ''}`} />
                        </motion.button>
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
                    transition={{ duration: 0.5 }}
                    className="min-h-[200px] flex flex-col justify-center"
                  >
                    {/* The question */}
                    <p className="font-serif text-2xl md:text-3xl text-foreground/40 leading-relaxed mb-12 max-w-2xl">
                      "{submittedQuestion}"
                    </p>
                    
                    {/* Elegant loading animation */}
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <motion.div
                            key={i}
                            className="h-1 w-8 bg-foreground/20 origin-left"
                            animate={{
                              scaleX: [0.3, 1, 0.3],
                              opacity: [0.3, 1, 0.3],
                            }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              delay: i * 0.15,
                              ease: "easeInOut"
                            }}
                          />
                        ))}
                      </div>
                      <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground/40">
                        Retrieving context
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
                    transition={{ duration: 0.6 }}
                  >
                    {/* Question */}
                    <div className="mb-8 pb-6 border-b border-foreground/10">
                      <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground/40 mb-3">
                        Your question
                      </p>
                      <p className="font-serif text-lg text-muted-foreground/50">
                        {submittedQuestion}
                      </p>
                    </div>

                    {/* The Answer */}
                    <div className="mb-10">
                      <motion.p 
                        className="font-serif text-xl md:text-2xl text-foreground leading-[1.7] tracking-tight"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {displayedAnswer}
                        {!isTypingComplete && (
                          <motion.span 
                            className="inline-block w-0.5 h-6 bg-foreground/70 ml-1 align-middle"
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                          />
                        )}
                      </motion.p>
                    </div>

                    {/* Sources */}
                    <AnimatePresence>
                      {sources.length > 0 && isTypingComplete && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          className="mt-12 pt-8 border-t border-foreground/10"
                        >
                          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground/40 mb-6">
                            Explore further
                          </p>
                          
                          <div className="grid gap-3">
                            {sources.map((source, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * i }}
                              >
                                <Link
                                  href={source.url}
                                  className="group/link flex items-center justify-between py-4 px-5 -mx-5 hover:bg-foreground/[0.03] transition-colors duration-300"
                                >
                                  <div className="flex items-center gap-5">
                                    <span className="font-mono text-[10px] tracking-wider uppercase text-foreground/30 w-16">
                                      {source.category}
                                    </span>
                                    <span className="font-serif text-base text-foreground/70 group-hover/link:text-foreground transition-colors duration-300">
                                      {source.title}
                                    </span>
                                  </div>
                                  <ArrowRight className="h-4 w-4 text-foreground/20 group-hover/link:text-foreground/60 group-hover/link:translate-x-1 transition-all duration-300" />
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
                        transition={{ delay: 0.4 }}
                        className="mt-12 pt-8 border-t border-foreground/10 flex items-center justify-between"
                      >
                        {!hasReachedLimit ? (
                          <motion.button
                            onClick={handleReset}
                            className="group/reset inline-flex items-center gap-3 font-display text-sm text-muted-foreground/60 hover:text-foreground transition-colors duration-300"
                            whileHover={{ x: 4 }}
                          >
                            <span>Ask another question</span>
                            <ArrowRight className="h-4 w-4 group-hover/reset:translate-x-1 transition-transform duration-300" />
                          </motion.button>
                        ) : (
                          <p className="font-serif text-sm text-muted-foreground/40 italic">
                            You've explored your questions for this session
                          </p>
                        )}
                        
                        <div className="flex items-center gap-2">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 w-1 rounded-full ${
                                i < questionsRemaining 
                                  ? 'bg-foreground/30' 
                                  : 'bg-foreground/10'
                              }`}
                            />
                          ))}
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
                    className="py-16 text-center"
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 6, repeat: Infinity }}
                      className="inline-block p-4 border border-foreground/10 mb-8"
                    >
                      <Sparkles className="h-6 w-6 text-foreground/30" />
                    </motion.div>
                    <p className="font-serif text-xl text-muted-foreground/50 mb-3">
                      You've explored all five questions
                    </p>
                    <p className="font-mono text-xs tracking-wider text-muted-foreground/30 uppercase">
                      Browse the writings below or return later
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
