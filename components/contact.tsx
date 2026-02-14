"use client"

import { useEffect, useRef } from "react"
import { ArrowUpRight, Github, Linkedin, Mail, Phone } from "lucide-react"

const links = [
  {
    label: "GitHub",
    href: "https://github.com/SinghalAs",
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/SinghalAs",
    icon: Linkedin,
  },
  {
    label: "Email",
    href: "mailto:ashishsinghal780@gmail.com",
    icon: Mail,
  },
  {
    label: "Phone",
    href: "tel:+918218657357",
    icon: Phone,
  },
]

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up")
          }
        })
      },
      { threshold: 0.2 }
    )
    const items = sectionRef.current?.querySelectorAll("[data-reveal]")
    items?.forEach((el, i) => {
      const element = el as HTMLElement
      element.style.animationDelay = `${i * 100}ms`
      observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="px-6 md:px-12 lg:px-24 py-28 md:py-36 bg-card"
    >
      <div className="max-w-3xl">
        <p
          data-reveal
          className="opacity-0 font-mono text-[11px] tracking-widest uppercase text-muted-foreground mb-4"
        >
          / 06
        </p>
        <h2
          data-reveal
          className="opacity-0 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-card-foreground leading-[1.05]"
        >
          {"Let's build"}
          <br />
          something together.
        </h2>
        <p
          data-reveal
          className="opacity-0 text-sm text-muted-foreground mt-6 leading-relaxed max-w-md"
        >
          Open to discussing GenAI engineering, RAG architecture, agent systems,
          or interesting collaboration opportunities. Based in Noida, India.
        </p>

        <div data-reveal className="opacity-0 mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-4 text-sm font-medium text-card-foreground border border-border px-5 py-4 transition-all duration-300 hover:bg-foreground hover:text-background"
              >
                <Icon className="h-4 w-4 text-muted-foreground group-hover:text-background transition-colors duration-300" />
                <span className="flex-1">{link.label}</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-background transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            )
          })}
        </div>

        <p data-reveal className="opacity-0 mt-8 font-mono text-xs text-muted-foreground">
          ashishsinghal780@gmail.com
        </p>
      </div>
    </section>
  )
}
