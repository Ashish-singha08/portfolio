"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Sparkles, ArrowRight } from "lucide-react"

export function AskCTA() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
    <section ref={containerRef} className="px-6 md:px-12 lg:px-24 py-8 md:py-12">
      <Link href="/insights" className="block group">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden bg-card rounded-xl"
        >
          {/* Gradient accent top */}
          <div className="h-1 w-full bg-gradient-to-r from-[hsl(210,55%,55%)] via-[hsl(150,45%,45%)] to-[hsl(35,75%,48%)]" />
          
          {/* Background animated gradient blob */}
          <motion.div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[hsl(210,55%,55%,0.08)] blur-3xl"
            animate={{ 
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <div className="relative p-8 md:p-12 border-x border-b border-border rounded-b-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              
              {/* Left: Icon + Copy */}
              <div className="flex items-start gap-5">
                {/* Animated Icon */}
                <motion.div
                  className="shrink-0 p-4 bg-[hsl(210,55%,55%,0.1)] rounded-xl relative"
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="h-6 w-6 text-[hsl(210,55%,55%)]" />
                  {/* Pulse ring */}
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-[hsl(210,55%,55%)]"
                    animate={{ 
                      scale: [1, 1.4],
                      opacity: [0.5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>

                {/* Copy */}
                <div className="max-w-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-[hsl(150,45%,45%)] bg-[hsl(150,45%,45%,0.1)] px-2 py-0.5 rounded">
                      NEW
                    </span>
                    <span className="font-mono text-[10px] tracking-wider text-muted-foreground">
                      RAG-Powered Search
                    </span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight mb-3 group-hover:text-[hsl(210,55%,55%)] transition-colors duration-300">
                    Ask my knowledge base anything
                  </h3>
                  
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Search across everything I've written about embeddings, vector databases, RAG pipelines, and AI architecture.
                  </p>
                </div>
              </div>

              {/* Right: CTA */}
              <div className="flex items-center gap-4 lg:shrink-0">
                <div className="flex flex-col items-end">
                  <span className="text-base font-semibold text-foreground">
                    Try it now
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground mt-0.5">
                    5 questions per visit
                  </span>
                </div>
                <motion.div 
                  className="p-3 bg-[hsl(210,55%,55%)] rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowRight className="h-5 w-5 text-white group-hover:translate-x-1 transition-transform duration-300" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </section>
  )
}
