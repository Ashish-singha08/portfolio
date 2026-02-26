"use client"

import { useState, useRef, useEffect } from "react"

interface Source {
  title: string
  url: string
  category: string
}

interface Conversation {
  question: string
  answer: string
  sources: Source[]
}

export function AskInsight() {
  const [question, setQuestion] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [questionsRemaining, setQuestionsRemaining] = useState(5)
  const [displayedAnswer, setDisplayedAnswer] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const answerRef = useRef<HTMLDivElement>(null)

  const hasReachedLimit = questionsRemaining <= 0

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
    }
  }, [question])

  // Typewriter effect for answers
  useEffect(() => {
    if (conversations.length === 0 || isTyping) return
    
    const latestAnswer = conversations[conversations.length - 1]?.answer
    if (!latestAnswer || displayedAnswer === latestAnswer) return

    setIsTyping(true)
    let i = 0
    const interval = setInterval(() => {
      if (i < latestAnswer.length) {
        setDisplayedAnswer(latestAnswer.slice(0, i + 1))
        i++
      } else {
        setIsTyping(false)
        clearInterval(interval)
      }
    }, 12)

    return () => clearInterval(interval)
  }, [conversations, displayedAnswer, isTyping])

  // Scroll to answer when it appears
  useEffect(() => {
    if (displayedAnswer && answerRef.current) {
      answerRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [displayedAnswer])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim() || isThinking || hasReachedLimit) return

    const currentQuestion = question.trim()
    setQuestion("")
    setIsThinking(true)
    setDisplayedAnswer("")

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentQuestion }),
      })

      const data = await res.json()
      
      setConversations(prev => [...prev, {
        question: currentQuestion,
        answer: data.answer || "I couldn't find an answer to that.",
        sources: data.sources || [],
      }])
      setQuestionsRemaining(prev => prev - 1)
    } catch {
      setConversations(prev => [...prev, {
        question: currentQuestion,
        answer: "Something went wrong. Please try again.",
        sources: [],
      }])
    } finally {
      setIsThinking(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <section className="mb-24">
      {/* The prompt area */}
      <div className="max-w-2xl">
        {!hasReachedLimit ? (
          <>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-6">
              Ask anything about the writings here
            </p>
            
            <form onSubmit={handleSubmit} className="relative">
              <textarea
                ref={inputRef}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What would you like to know?"
                disabled={isThinking}
                rows={1}
                className="w-full bg-transparent text-foreground text-lg md:text-xl font-serif leading-relaxed placeholder:text-muted-foreground/30 focus:outline-none resize-none overflow-hidden disabled:opacity-50"
                style={{ minHeight: "2rem" }}
              />
              
              {/* Subtle underline */}
              <div className="h-px bg-border mt-4" />
              
              {/* Submit hint and remaining count */}
              <div className="flex items-center justify-between mt-4">
                <span className="font-mono text-[10px] tracking-wide text-muted-foreground/40">
                  {questionsRemaining} {questionsRemaining === 1 ? "question" : "questions"} remaining
                </span>
                
                {question.trim() && !isThinking && (
                  <button
                    type="submit"
                    className="font-mono text-[10px] tracking-wide text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Press Enter
                  </button>
                )}
              </div>
            </form>
          </>
        ) : (
          <div className="py-8">
            <p className="font-serif text-muted-foreground text-lg leading-relaxed">
              You have explored all five questions for this visit.
            </p>
            <p className="font-serif text-muted-foreground/60 text-base mt-3 leading-relaxed">
              Perhaps browse the articles below, or return another time with fresh curiosity.
            </p>
          </div>
        )}
      </div>

      {/* Thinking state */}
      {isThinking && (
        <div className="mt-16 max-w-2xl">
          <div className="flex items-center gap-3">
            <ThinkingDots />
            <span className="font-mono text-[10px] tracking-wide text-muted-foreground/50">
              contemplating
            </span>
          </div>
        </div>
      )}

      {/* Conversations */}
      {conversations.length > 0 && (
        <div className="mt-16 space-y-16">
          {conversations.map((conv, i) => (
            <div key={i} className="max-w-2xl">
              {/* The question asked */}
              <p className="font-serif text-muted-foreground/50 text-sm mb-6 italic">
                {conv.question}
              </p>
              
              {/* The answer */}
              <div ref={i === conversations.length - 1 ? answerRef : null}>
                <p className="font-serif text-foreground/90 text-lg leading-[1.8]">
                  {i === conversations.length - 1 ? displayedAnswer : conv.answer}
                  {i === conversations.length - 1 && isTyping && (
                    <span className="inline-block w-px h-5 bg-foreground/60 ml-0.5 animate-pulse" />
                  )}
                </p>
              </div>
              
              {/* Sources - only show after typing is complete or for previous conversations */}
              {conv.sources.length > 0 && (i < conversations.length - 1 || !isTyping) && (
                <div className="mt-8 pt-6 border-t border-border/50">
                  <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground/40 mb-4">
                    From
                  </p>
                  <div className="space-y-2">
                    {conv.sources.map((source, j) => (
                      <a
                        key={j}
                        href={source.url}
                        className="block group"
                      >
                        <span className="font-serif text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {source.title}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground/40 ml-2">
                          {source.category}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function ThinkingDots() {
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1 h-1 bg-muted-foreground/40 rounded-full animate-pulse"
          style={{
            animationDelay: `${i * 200}ms`,
            animationDuration: "1s",
          }}
        />
      ))}
    </div>
  )
}
