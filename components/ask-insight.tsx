"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

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
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const questionsRemaining = 5 - questionsUsed
  const hasReachedLimit = questionsRemaining <= 0

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
    }
  }, [question])

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
        const delay = ['.', ',', '—', ':'].includes(char) ? 60 : char === ' ' ? 25 : 18
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

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const isTypingComplete = displayedAnswer.length === answer.length

  return (
    <section className="mb-20 mt-4">
      {/* Container with premium border treatment */}
      <div className="relative">
        {/* Outer glow for dark mode, subtle shadow for light */}
        <div 
          className="absolute -inset-px rounded-sm opacity-0 transition-opacity duration-700"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--foreground) / 0.1), transparent, hsl(var(--foreground) / 0.05))',
            opacity: isFocused && phase === 'idle' ? 1 : 0,
          }}
        />
        
        {/* Main container */}
        <div className="relative border border-border bg-card/50 backdrop-blur-sm">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px">
            <div 
              className="h-full bg-foreground/30 transition-all duration-1000 ease-out"
              style={{ 
                width: phase === 'thinking' ? '100%' : isFocused ? '100%' : '0%',
                marginLeft: phase === 'thinking' ? '0%' : isFocused ? '0%' : '50%',
              }}
            />
          </div>

          {/* === IDLE STATE === */}
          {phase === "idle" && !hasReachedLimit && (
            <div className="p-8 md:p-12">
              <form onSubmit={handleSubmit}>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-foreground/20" />
                    <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                      Ask anything
                    </span>
                  </div>
                  <span className="font-mono text-[10px] tracking-wider text-muted-foreground/50">
                    {questionsRemaining}/5
                  </span>
                </div>

                {/* The Input */}
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="What would you like to understand?"
                    rows={1}
                    className="w-full bg-transparent text-foreground text-xl md:text-2xl font-serif placeholder:text-muted-foreground/30 focus:outline-none leading-relaxed resize-none overflow-hidden"
                    autoComplete="off"
                    spellCheck="false"
                  />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
                  <p className="text-xs text-muted-foreground/40 max-w-xs hidden md:block">
                    Ask about RAG, embeddings, AI architecture, or anything in my writings.
                  </p>
                  
                  <button
                    type="submit"
                    disabled={!question.trim()}
                    className={`
                      group inline-flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase
                      px-5 py-2.5 border transition-all duration-300
                      ${question.trim() 
                        ? 'border-foreground/20 text-foreground hover:bg-foreground hover:text-background' 
                        : 'border-transparent text-muted-foreground/30 cursor-not-allowed'
                      }
                    `}
                  >
                    <span>Ask</span>
                    <ArrowRight className={`h-3 w-3 transition-transform duration-300 ${question.trim() ? 'group-hover:translate-x-0.5' : ''}`} />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* === THINKING STATE === */}
          {phase === "thinking" && (
            <div className="p-8 md:p-12">
              {/* Question being pondered */}
              <div className="mb-10">
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground/50 block mb-4">
                  Searching
                </span>
                <p className="text-xl md:text-2xl font-serif text-foreground/60 leading-relaxed">
                  {submittedQuestion}
                </p>
              </div>
              
              {/* Animated thinking indicator */}
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-foreground/40"
                      style={{
                        animation: 'thinking-dot 1.4s ease-in-out infinite',
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
                <span className="font-mono text-[10px] tracking-wider text-muted-foreground/40">
                  retrieving context
                </span>
              </div>
            </div>
          )}

          {/* === ANSWER STATE === */}
          {phase === "answering" && (
            <div className="p-8 md:p-12">
              {/* The question */}
              <div className="mb-8 pb-6 border-b border-border/30">
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground/40 block mb-3">
                  You asked
                </span>
                <p className="text-base font-serif text-muted-foreground/60 leading-relaxed">
                  {submittedQuestion}
                </p>
              </div>

              {/* The answer */}
              <div className="mb-8">
                <p className="font-serif text-lg md:text-xl text-foreground leading-[1.8] tracking-tight">
                  {displayedAnswer}
                  {!isTypingComplete && (
                    <span 
                      className="inline-block w-0.5 h-5 bg-foreground/70 ml-0.5 align-middle"
                      style={{ animation: 'cursor-blink 1s ease-in-out infinite' }}
                    />
                  )}
                </p>
              </div>

              {/* Sources */}
              {sources.length > 0 && isTypingComplete && (
                <div 
                  className="mt-10 pt-6 border-t border-border/30"
                  style={{ animation: 'fade-in 0.6s ease-out forwards' }}
                >
                  <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground/40 block mb-5">
                    Go deeper
                  </span>
                  
                  <div className="space-y-3">
                    {sources.map((source, i) => (
                      <Link
                        key={i}
                        href={source.url}
                        className="group flex items-center justify-between py-3 px-4 -mx-4 hover:bg-secondary/50 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-wider">
                            {source.category}
                          </span>
                          <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                            {source.title}
                          </span>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-foreground/60 group-hover:translate-x-0.5 transition-all duration-200" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {isTypingComplete && (
                <div 
                  className="mt-10 pt-6 border-t border-border/30 flex items-center justify-between"
                  style={{ animation: 'fade-in 0.6s ease-out 0.2s forwards', opacity: 0 }}
                >
                  {!hasReachedLimit ? (
                    <button
                      onClick={handleReset}
                      className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase text-muted-foreground/60 hover:text-foreground transition-colors duration-300"
                    >
                      <span>Ask another</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                    </button>
                  ) : (
                    <p className="font-serif text-sm text-muted-foreground/40 italic">
                      Questions for this visit complete
                    </p>
                  )}
                  
                  <span className="font-mono text-[10px] tracking-wider text-muted-foreground/30">
                    {questionsRemaining}/5 remaining
                  </span>
                </div>
              )}
            </div>
          )}

          {/* === LIMIT REACHED === */}
          {hasReachedLimit && phase === "idle" && (
            <div className="p-8 md:p-12 text-center">
              <div className="h-2 w-2 rounded-full bg-foreground/10 mx-auto mb-6" />
              <p className="font-serif text-lg text-muted-foreground/50 leading-relaxed mb-2">
                You've explored your questions for this visit.
              </p>
              <p className="font-mono text-[11px] tracking-wider text-muted-foreground/30 uppercase">
                Browse the writings below
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        @keyframes thinking-dot {
          0%, 80%, 100% { 
            transform: scale(0.8);
            opacity: 0.4;
          }
          40% { 
            transform: scale(1.2);
            opacity: 1;
          }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
