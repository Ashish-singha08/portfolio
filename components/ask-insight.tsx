"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowRight } from "lucide-react"

interface Source {
  title: string
  url: string
  category: string
}

type Phase = "idle" | "thinking" | "answering"

export function AskInsight() {
  const [question, setQuestion] = useState("")
  const [phase, setPhase] = useState<Phase>("idle")
  const [answer, setAnswer] = useState("")
  const [sources, setSources] = useState<Source[]>([])
  const [displayedAnswer, setDisplayedAnswer] = useState("")
  const [questionsUsed, setQuestionsUsed] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const answerRef = useRef<HTMLDivElement>(null)

  const questionsRemaining = 5 - questionsUsed
  const hasReachedLimit = questionsRemaining <= 0

  // Typewriter effect
  useEffect(() => {
    if (phase !== "answering" || !answer) return

    let i = 0
    const interval = setInterval(() => {
      if (i < answer.length) {
        setDisplayedAnswer(answer.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
      }
    }, 18)

    return () => clearInterval(interval)
  }, [phase, answer])

  // Scroll to answer
  useEffect(() => {
    if (phase === "answering" && answerRef.current) {
      setTimeout(() => {
        answerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 100)
    }
  }, [phase])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim() || phase !== "idle" || hasReachedLimit) return

    const q = question.trim()
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
    setQuestion("")
    setPhase("idle")
    setAnswer("")
    setSources([])
    setDisplayedAnswer("")
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <section className="mb-20 mt-4">
      <div className="max-w-2xl">
        
        {/* Idle state — the prompt */}
        {phase === "idle" && !hasReachedLimit && (
          <div className="animate-fade-up">
            <form onSubmit={handleSubmit} className="group">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about my work..."
                  className="w-full bg-transparent text-foreground text-xl md:text-2xl font-serif placeholder:text-muted-foreground/25 focus:outline-none tracking-tight"
                  autoComplete="off"
                />
                
                {/* Animated underline */}
                <div className="absolute -bottom-3 left-0 right-0 h-px bg-border" />
                <div 
                  className="absolute -bottom-3 left-0 h-px bg-foreground/40 transition-all duration-500 ease-out"
                  style={{ width: question ? "100%" : "0%" }}
                />
              </div>

              {/* Footer with count and submit */}
              <div className="flex items-center justify-between mt-6">
                <span className="text-[11px] tracking-widest uppercase text-muted-foreground/30 font-mono">
                  {questionsRemaining} left
                </span>
                
                <button
                  type="submit"
                  disabled={!question.trim()}
                  className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-muted-foreground/50 hover:text-foreground disabled:opacity-0 transition-all duration-300 font-mono group/btn"
                >
                  <span>Ask</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Thinking state */}
        {phase === "thinking" && (
          <div className="py-8 animate-fade-up">
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 bg-foreground/30 rounded-full"
                    style={{
                      animation: "pulse 1.4s ease-in-out infinite",
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
              <span className="text-[11px] tracking-widest uppercase text-muted-foreground/40 font-mono">
                Thinking
              </span>
            </div>
          </div>
        )}

        {/* Answer state */}
        {phase === "answering" && (
          <div ref={answerRef} className="animate-fade-up">
            {/* The answer */}
            <p className="font-serif text-lg md:text-xl text-foreground/90 leading-relaxed tracking-tight">
              {displayedAnswer}
              {displayedAnswer.length < answer.length && (
                <span className="inline-block w-0.5 h-5 bg-foreground/50 ml-0.5 animate-pulse align-middle" />
              )}
            </p>

            {/* Sources */}
            {sources.length > 0 && displayedAnswer.length === answer.length && (
              <div className="mt-10 pt-6 border-t border-border/40 animate-fade-up">
                <span className="text-[10px] tracking-widest uppercase text-muted-foreground/30 font-mono">
                  Related
                </span>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                  {sources.map((source, i) => (
                    <a
                      key={i}
                      href={source.url}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 font-serif"
                    >
                      {source.title}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Ask another */}
            {displayedAnswer.length === answer.length && !hasReachedLimit && (
              <button
                onClick={handleReset}
                className="mt-10 text-[11px] tracking-widest uppercase text-muted-foreground/40 hover:text-muted-foreground transition-colors duration-200 font-mono"
              >
                Ask another question
              </button>
            )}
          </div>
        )}

        {/* Limit reached */}
        {hasReachedLimit && phase === "idle" && (
          <div className="py-4 animate-fade-up">
            <p className="font-serif text-muted-foreground/60 text-lg leading-relaxed">
              You've asked your five questions for this visit.
            </p>
            <p className="font-serif text-muted-foreground/40 text-base mt-2">
              The articles below await your curiosity.
            </p>
          </div>
        )}

        {/* Show limit message after final answer */}
        {hasReachedLimit && phase === "answering" && displayedAnswer.length === answer.length && (
          <p className="mt-10 font-serif text-muted-foreground/40 text-sm animate-fade-up">
            That was your last question for this visit.
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </section>
  )
}
