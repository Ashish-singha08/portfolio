"use client"

import { useEffect, useRef } from "react"
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react"

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const children = containerRef.current?.querySelectorAll("[data-animate]")
    children?.forEach((el, i) => {
      const element = el as HTMLElement
      element.style.animationDelay = `${i * 150 + 200}ms`
      element.classList.add("animate-fade-up")
    })
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 py-24">
      {/* Ambient grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(0 0% 93%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 93%) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }} />

      <div ref={containerRef} className="relative max-w-5xl">
        <div data-animate className="opacity-0 mb-8">
          <div className="inline-flex items-center gap-3 border border-border px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
              GenAI Engineer at Axtria
            </span>
          </div>
        </div>

        <h1
          data-animate
          className="opacity-0 text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter text-foreground leading-[0.92] text-balance"
        >
          Ashish
          <br />
          Singhal
        </h1>

        <div data-animate className="opacity-0 mt-8 max-w-xl">
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            GenAI Engineer specializing in multi-vector retrieval systems
            and production RAG architectures. Building AI agents that serve
            Fortune 500 clients.
          </p>
        </div>

        <div data-animate className="opacity-0 mt-10 flex flex-wrap items-center gap-5">
          <a
            href="#expertise"
            className="group inline-flex items-center gap-3 text-sm font-medium text-background bg-foreground px-6 py-3 transition-all duration-300 hover:opacity-90"
          >
            <span>Explore Work</span>
            <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-3 text-sm font-medium text-foreground border border-border px-6 py-3 transition-all duration-300 hover:bg-secondary"
          >
            Get in Touch
          </a>
          <div className="flex items-center gap-4 ml-2">
            <a
              href="https://github.com/SinghalAs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors duration-300"
              aria-label="GitHub"
            >
              <Github className="h-4.5 w-4.5" />
            </a>
            <a
              href="https://linkedin.com/in/SinghalAs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4.5 w-4.5" />
            </a>
            <a
              href="mailto:ashishsinghal780@gmail.com"
              className="text-muted-foreground hover:text-foreground transition-colors duration-300"
              aria-label="Email"
            >
              <Mail className="h-4.5 w-4.5" />
            </a>
          </div>
        </div>

        {/* Impact metrics strip */}
        <div
          data-animate
          className="opacity-0 mt-20 pt-8 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          {[
            { value: "5", label: "AI Agents Shipped" },
            { value: "$4M+", label: "Revenue Delivered" },
            { value: "4,000+", label: "Users Served" },
            { value: "Top 1%", label: "Axtria Performer" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl md:text-3xl font-bold text-foreground tracking-tight font-mono">
                {stat.value}
              </p>
              <p className="font-mono text-[11px] text-muted-foreground mt-1.5 tracking-wide uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
