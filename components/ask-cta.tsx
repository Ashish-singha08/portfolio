"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { HowItWorksTrigger } from "@/components/how-it-works-modal"

const SAMPLE_QA = [
  { q: "How do I choose chunk size?", a: "Start with recursive chunking at 300 tokens with 10–15% overlap." },
  { q: "What are embeddings?", a: "Dense vector representations of semantic meaning in high-dimensional space." },
  { q: "RAG vs fine-tuning?", a: "RAG for dynamic knowledge retrieval. Fine-tuning for behavioral changes." },
  { q: "When to use semantic chunking?", a: "Long documents that shift topics without structural markers like headers." },
]

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%"

function ScrambleText({ text }: { text: string }) {
  const [output, setOutput] = useState("")
  const frameRef = useRef<number>(0)

  useEffect(() => {
    let iter = 0
    const total = text.length * 3
    const tick = () => {
      iter++
      const resolved = Math.floor((iter / total) * text.length)
      setOutput(
        text.split("").map((c, i) => {
          if (c === " ") return " "
          if (i < resolved) return c
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        }).join("")
      )
      if (resolved < text.length) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        setOutput(text)
      }
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [text])

  return <>{output}</>
}

// Canvas particle field — reads CSS variable for amber color
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const particlesRef = useRef<Array<{
    x: number; y: number; vx: number; vy: number
    size: number; alpha: number; targetAlpha: number
  }>>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      particlesRef.current = Array.from({ length: 55 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.25 + 0.05,
        targetAlpha: Math.random() * 0.25 + 0.05,
      }))
    }
    resize()

    const move = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    canvas.addEventListener("mousemove", move)
    canvas.addEventListener("mouseleave", () => { mouseRef.current = { x: -1000, y: -1000 } })

    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const ps = particlesRef.current
      const m = mouseRef.current

      ps.forEach(p => {
        const dx = p.x - m.x
        const dy = p.y - m.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 90) {
          const force = (90 - dist) / 90
          p.vx += (dx / dist) * force * 0.7
          p.vy += (dy / dist) * force * 0.7
        }
        p.vx *= 0.98
        p.vy *= 0.98
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        if (Math.random() < 0.01) p.targetAlpha = Math.random() * 0.3 + 0.04
        p.alpha += (p.targetAlpha - p.alpha) * 0.05

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha})`
        ctx.fill()
      })

      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x
          const dy = ps[i].y - ps[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 80) {
            ctx.beginPath()
            ctx.moveTo(ps[i].x, ps[i].y)
            ctx.lineTo(ps[j].x, ps[j].y)
            ctx.strokeStyle = `rgba(245, 158, 11, ${(1 - d / 80) * 0.07})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()

    window.addEventListener("resize", resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ opacity: 0.5 }}
    />
  )
}

export function AskCTA() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-80px" })
  const [activeQ, setActiveQ] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [displayedA, setDisplayedA] = useState("")
  const [hovered, setHovered] = useState(false)

  // Magnetic arrow
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 })
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 })
  const arrowX = useTransform(springX, [-300, 300], [-10, 10])
  const arrowY = useTransform(springY, [-150, 150], [-6, 6])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      mouseX.set(e.clientX - r.left - r.width / 2)
      mouseY.set(e.clientY - r.top - r.height / 2)
    }
    const leave = () => { mouseX.set(0); mouseY.set(0) }
    el.addEventListener("mousemove", move)
    el.addEventListener("mouseleave", leave)
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave) }
  }, [mouseX, mouseY])

  // Cycle Q&A typewriter
  useEffect(() => {
    if (!isInView) return
    let t: NodeJS.Timeout
    const qa = SAMPLE_QA[activeQ]
    setIsTyping(true)
    setDisplayedA("")
    let i = 0
    const type = () => {
      if (i < qa.a.length) {
        setDisplayedA(qa.a.slice(0, i + 1))
        i++
        t = setTimeout(type, 20)
      } else {
        setIsTyping(false)
        t = setTimeout(() => {
          setDisplayedA("")
          setActiveQ(p => (p + 1) % SAMPLE_QA.length)
        }, 3000)
      }
    }
    t = setTimeout(type, 500)
    return () => clearTimeout(t)
  }, [activeQ, isInView])

  return (
    <section ref={containerRef} className="px-6 md:px-12 lg:px-24 py-8 md:py-12">
      <Link
        href="/insights"
        className="block group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden bg-card border border-amber-500/15 hover:border-amber-500/35 transition-colors duration-500"
        >
          {/* Particle canvas */}
          <ParticleCanvas />

          {/* Amber top line */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, #F59E0B, #FBBF24, transparent)" }}
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          />

          {/* Hover glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 50% 40% at 80% 50%, rgba(245,158,11,0.05), transparent)",
            }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />

          <div className="relative z-10 p-8 md:p-12">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 lg:items-center">

              {/* Left */}
              <div className="flex-1 min-w-0">
                <motion.div
                  className="flex items-center gap-3 mb-5"
                  initial={{ opacity: 0, x: -16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <motion.div
                    className="h-1.5 w-1.5 rounded-full bg-amber-500"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-amber-500/70">
                    RAG-Powered Search
                  </span>
                </motion.div>

                <motion.h3
                  className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight mb-8"
                  initial={{ opacity: 0, y: 12 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4, duration: 0.7 }}
                >
                  Ask my knowledge base{" "}
                  <span className="text-amber-500">anything</span>
                </motion.h3>

                {/* Live demo */}
                <motion.div
                  className="relative pl-4 border-l-2 border-amber-500/25"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.6 }}
                >
                  <motion.p
                    key={activeQ}
                    className="font-mono text-[11px] tracking-wide text-amber-500/50 mb-2"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25 }}
                  >
                    &gt; &ldquo;<ScrambleText text={SAMPLE_QA[activeQ].q} />&rdquo;
                  </motion.p>

                  <p className="font-serif text-base text-muted-foreground leading-relaxed min-h-[1.6em]">
                    {displayedA}
                    {isTyping && (
                      <motion.span
                        className="inline-block w-px h-[1em] bg-amber-500 ml-0.5 align-middle"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.4, repeat: Infinity }}
                      />
                    )}
                  </p>
                </motion.div>
              </div>

              {/* Right */}
              <motion.div
                className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-6 lg:shrink-0"
                initial={{ opacity: 0, x: 16 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5, duration: 0.7 }}
              >
                <div className="text-right space-y-1">
                  <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
                    5 questions per visit
                  </p>
                  <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground/40">
                    Free · No login
                  </p>
                  {/* How it works trigger — inline in CTA */}
                  <div className="pt-1" onClick={e => e.preventDefault()}>
                    <HowItWorksTrigger />
                  </div>
                </div>

                {/* Magnetic button */}
                <motion.div style={{ x: arrowX, y: arrowY }} className="relative">
                  <motion.div
                    className="flex items-center justify-center h-14 w-14 bg-amber-500"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowRight className="h-5 w-5 text-black" />
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 border border-amber-500"
                    animate={hovered ? { scale: [1, 1.8], opacity: [0.5, 0] } : { scale: 1, opacity: 0 }}
                    transition={{ duration: 0.8, repeat: hovered ? Infinity : 0 }}
                  />
                </motion.div>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </Link>
    </section>
  )
}