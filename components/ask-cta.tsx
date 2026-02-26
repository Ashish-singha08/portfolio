"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Sparkles, ArrowRight } from "lucide-react"

export function AskCTA() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
    <section ref={containerRef} className="px-6 md:px-12 lg:px-24 py-12 md:py-20">
      <Link href="/insights" className="block group">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative border-2 border-border bg-card hover:border-foreground hover:bg-secondary transition-all duration-500"
        >
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-foreground transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

          <div className="p-8 md:p-12 lg:p-16">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              
              {/* Left: Icon + Copy */}
              <div className="flex items-start gap-6">
                {/* Icon */}
                <motion.div
                  className="shrink-0 p-4 border-2 border-border bg-background group-hover:border-foreground group-hover:bg-secondary transition-all duration-500"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="h-6 w-6 text-foreground" />
                </motion.div>

                {/* Copy */}
                <div className="max-w-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
                      New
                    </span>
                    <span className="h-px w-4 bg-muted-foreground" />
                    <span className="font-mono text-xs tracking-wider text-muted-foreground">
                      RAG-Powered Search
                    </span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight mb-4">
                    Ask my knowledge base anything
                  </h3>
                  
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    Search across everything I've written about embeddings, vector databases, RAG pipelines, and AI architecture.
                  </p>
                </div>
              </div>

              {/* Right: CTA */}
              <div className="flex items-center gap-4 lg:shrink-0">
                <div className="flex flex-col items-end">
                  <span className="font-display text-lg font-semibold text-foreground">
                    Try it now
                  </span>
                  <span className="font-mono text-xs text-muted-foreground mt-1">
                    5 questions per visit
                  </span>
                </div>
                <div className="p-4 border-2 border-border bg-background group-hover:bg-foreground group-hover:border-foreground transition-all duration-300">
                  <ArrowRight className="h-5 w-5 text-foreground group-hover:text-background group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </section>
  )
}
