"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Sparkles, ArrowRight } from "lucide-react"

export function AskCTA() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
    <section ref={containerRef} className="px-6 md:px-12 lg:px-24 py-16 md:py-24">
      <Link href="/insights" className="block group">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden"
        >
          {/* Background with gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.04] via-transparent to-foreground/[0.02]" />
          
          {/* Animated border */}
          <div className="absolute inset-0 border border-foreground/10 group-hover:border-foreground/20 transition-colors duration-700" />
          
          {/* Animated corner accents */}
          <div className="absolute top-0 left-0 w-12 h-px bg-gradient-to-r from-foreground/40 to-transparent transition-all duration-700 group-hover:w-24" />
          <div className="absolute top-0 left-0 w-px h-12 bg-gradient-to-b from-foreground/40 to-transparent transition-all duration-700 group-hover:h-24" />
          <div className="absolute bottom-0 right-0 w-12 h-px bg-gradient-to-l from-foreground/40 to-transparent transition-all duration-700 group-hover:w-24" />
          <div className="absolute bottom-0 right-0 w-px h-12 bg-gradient-to-t from-foreground/40 to-transparent transition-all duration-700 group-hover:h-24" />

          {/* Content */}
          <div className="relative px-8 py-12 md:px-16 md:py-16 lg:px-20 lg:py-20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
              
              {/* Left: Icon + Copy */}
              <div className="flex items-start gap-6 lg:gap-8">
                {/* Animated Icon */}
                <motion.div
                  className="relative shrink-0"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ 
                    duration: 6, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="p-4 md:p-5 border border-foreground/10 bg-foreground/[0.02] group-hover:bg-foreground/[0.05] group-hover:border-foreground/20 transition-all duration-500">
                    <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-foreground/60 group-hover:text-foreground/80 transition-colors duration-500" />
                  </div>
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl bg-foreground/10" />
                </motion.div>

                {/* Copy */}
                <div className="max-w-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-foreground/40">
                      New Feature
                    </span>
                    <span className="h-px w-6 bg-foreground/20" />
                    <span className="font-mono text-[10px] tracking-wider text-foreground/30">
                      RAG-Powered
                    </span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight mb-4 group-hover:text-foreground/90 transition-colors">
                    Ask my knowledge base anything
                  </h3>
                  
                  <p className="text-base md:text-lg text-muted-foreground/60 leading-relaxed group-hover:text-muted-foreground/80 transition-colors duration-500">
                    Search across everything I've written about embeddings, vector databases, RAG pipelines, and AI architecture. Like having a conversation with my blog.
                  </p>
                </div>
              </div>

              {/* Right: CTA */}
              <motion.div 
                className="flex items-center gap-4 lg:shrink-0"
                whileHover={{ x: 8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col items-end">
                  <span className="font-display text-lg font-medium text-foreground group-hover:text-foreground/80 transition-colors">
                    Try it now
                  </span>
                  <span className="font-mono text-[10px] tracking-wider text-muted-foreground/40 mt-1">
                    5 questions per session
                  </span>
                </div>
                <div className="p-4 border border-foreground/10 group-hover:border-foreground/30 group-hover:bg-foreground/5 transition-all duration-500">
                  <ArrowRight className="h-5 w-5 text-foreground/50 group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </motion.div>
            </div>

            {/* Bottom accent bar */}
            <div className="absolute bottom-0 left-0 right-0 h-px">
              <motion.div
                className="h-full bg-gradient-to-r from-transparent via-foreground/30 to-transparent"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        </motion.div>
      </Link>
    </section>
  )
}
