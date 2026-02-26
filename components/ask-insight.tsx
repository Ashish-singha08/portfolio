"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"

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

  // Typewriter effect with variable speed for natural feel
  useEffect(() => {
    if (phase !== "answering" || !answer) return

    let i = 0
    let timeout: NodeJS.Timeout

    const typeNext = () => {
      if (i < answer.length) {
        setDisplayedAnswer(answer.slice(0, i + 1))
        i++
        // Variable speed: slower at punctuation, faster mid-word
        const char = answer[i - 1]
        const delay = ['.', ',', '—', ':'].includes(char) ? 80 : 
                      char === ' ' ? 30 : 20
        timeout = setTimeout(typeNext, delay)
      }
    }

    timeout = setTimeout(typeNext, 300) // Initial delay before typing starts

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
      <div className="max-w-2xl mx-auto">
        
        {/* === IDLE STATE === */}
        {phase === "idle" && !hasReachedLimit && (
          <div className="animate-fade-up">
            <form onSubmit={handleSubmit}>
              {/* The Input — generous, centered, breathing */}
              <div className="relative py-12">
                {/* Breathing glow when focused */}
                <div 
                  className={`absolute inset-0 transition-opacity duration-700 ${isFocused ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    background: 'radial-gradient(ellipse at center, hsl(var(--foreground) / 0.03) 0%, transparent 70%)',
                  }}
                />
                
                <input
                  ref={inputRef}
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="What would you like to know?"
                  className="relative w-full bg-transparent text-foreground text-2xl md:text-3xl font-serif placeholder:text-muted-foreground/20 focus:outline-none tracking-tight text-center"
                  autoComplete="off"
                  spellCheck="false"
                />

                {/* Subtle animated cursor when empty and focused */}
                {isFocused && !question && (
                  <span 
                    className="absolute left-1/2 top-1/2 -translate-y-1/2 ml-[140px] md:ml-[180px] w-[2px] h-8 bg-foreground/40"
                    style={{ animation: 'cursor-blink 1s ease-in-out infinite' }}
                  />
                )}
              </div>

              {/* Animated line that responds to input */}
              <div className="relative h-px w-full overflow-hidden">
                <div className="absolute inset-0 bg-border/30" />
                <div 
                  className="absolute inset-y-0 left-1/2 -translate-x-1/2 bg-foreground/50 transition-all duration-700 ease-out"
                  style={{ 
                    width: isFocused ? (question ? '100%' : '60%') : '0%',
                  }}
                />
              </div>

              {/* Footer — count and submit */}
              <div className="flex items-center justify-between mt-8 px-1">
                <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground/25 font-mono">
                  {questionsRemaining} remaining
                </span>
                
                <button
                  type="submit"
                  disabled={!question.trim()}
                  className={`
                    text-[11px] tracking-[0.2em] uppercase font-mono
                    transition-all duration-500 ease-out
                    ${question.trim() 
                      ? 'text-foreground/60 hover:text-foreground' 
                      : 'text-transparent pointer-events-none'
                    }
                  `}
                >
                  Ask
                </button>
              </div>
            </form>
          </div>
        )}

        {/* === THINKING STATE === */}
        {phase === "thinking" && (
          <div className="py-16 animate-fade-up">
            {/* Show the question being pondered */}
            <p className="text-2xl md:text-3xl font-serif text-foreground/30 text-center tracking-tight mb-12">
              {submittedQuestion}
            </p>
            
            {/* Pulsing line — like a thought being processed */}
            <div className="flex justify-center">
              <div className="relative w-48 h-px overflow-hidden">
                <div className="absolute inset-0 bg-border/20" />
                <div 
                  className="absolute inset-y-0 bg-foreground/40"
                  style={{
                    animation: 'thinking-pulse 2s ease-in-out infinite',
                    width: '30%',
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* === ANSWER STATE === */}
        {phase === "answering" && (
          <div className="animate-fade-up">
            {/* The question — now muted */}
            <p className="text-lg font-serif text-muted-foreground/30 text-center tracking-tight mb-10 italic">
              {submittedQuestion}
            </p>

            {/* The answer — editorial, prominent */}
            <div className="relative">
              <p className="font-serif text-xl md:text-2xl text-foreground/90 leading-relaxed tracking-tight text-center text-balance">
                {displayedAnswer}
                {!isTypingComplete && (
                  <span 
                    className="inline-block w-[2px] h-6 bg-foreground/60 ml-1 align-middle"
                    style={{ animation: 'cursor-blink 0.8s ease-in-out infinite' }}
                  />
                )}
              </p>
            </div>

            {/* Sources — curated recommendations */}
            {sources.length > 0 && isTypingComplete && (
              <div className="mt-16 animate-fade-up">
                <div className="flex justify-center mb-6">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/30 font-mono">
                    Explore Further
                  </span>
                </div>
                
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
                  {sources.map((source, i) => (
                    <Link
                      key={i}
                      href={source.url}
                      className="group relative text-base font-serif text-muted-foreground/60 hover:text-foreground transition-colors duration-300"
                    >
                      <span>{source.title}</span>
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground/40 group-hover:w-full transition-all duration-300" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Ask another — an invitation */}
            {isTypingComplete && !hasReachedLimit && (
              <div className="mt-20 flex justify-center animate-fade-up">
                <button
                  onClick={handleReset}
                  className="group relative text-[11px] tracking-[0.2em] uppercase text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors duration-500 font-mono py-4"
                >
                  <span className="relative z-10">Continue exploring</span>
                  <span className="absolute inset-x-0 bottom-2 h-px bg-muted-foreground/10 group-hover:bg-muted-foreground/20 transition-colors duration-500" />
                </button>
              </div>
            )}

            {/* Final question message */}
            {isTypingComplete && hasReachedLimit && (
              <div className="mt-20 text-center animate-fade-up">
                <p className="font-serif text-muted-foreground/30 text-sm">
                  Your curiosity for this visit has been satisfied.
                </p>
              </div>
            )}
          </div>
        )}

        {/* === LIMIT REACHED (before any question) === */}
        {hasReachedLimit && phase === "idle" && (
          <div className="py-16 text-center animate-fade-up">
            <p className="font-serif text-xl text-muted-foreground/40 leading-relaxed">
              You've explored your questions for this visit.
            </p>
            <p className="font-serif text-base text-muted-foreground/25 mt-4">
              The writings below await.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        @keyframes thinking-pulse {
          0%, 100% { 
            left: 0%;
            opacity: 0.3;
          }
          50% { 
            left: 70%;
            opacity: 1;
          }
        }
      `}</style>
    </section>
  )
}
