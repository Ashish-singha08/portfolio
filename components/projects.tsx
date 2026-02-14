"use client"

import { useEffect, useRef } from "react"
import { ArrowUpRight } from "lucide-react"

const projects = [
  {
    num: "01",
    title: "Enterprise Chatbot Platform",
    client: "Fortune 500 Client",
    description:
      "Full-stack enterprise chatbot serving 4,000+ employees with 5,000+ monthly queries. React frontend, Flask API, and multi-vector RAG backend using AWS Lambda, OpenSearch, and FAISS.",
    impact: "92% answer accuracy",
    stack: ["React", "Flask", "FAISS", "OpenSearch", "AWS Lambda"],
  },
  {
    num: "02",
    title: "Unstructured Agent Pipeline",
    client: "Axtria Internal",
    description:
      "Multi-vector retrieval system combining Tantivy keyword indexes, FAISS Q&A stores, and Chroma semantic search. Custom intent classifier routes queries across 6 retrieval strategies based on query type.",
    impact: "Sub-second lookups",
    stack: ["LangChain", "Tantivy", "FAISS", "Chroma", "Python"],
  },
  {
    num: "03",
    title: "Agent Orchestration Dashboard",
    client: "Axtria Product",
    description:
      "No-code agent configuration platform built with CrewAI and LangChain. Business users deploy agents for scraping, reporting, and analytics without writing code.",
    impact: "16 active deployments",
    stack: ["CrewAI", "LangChain", "React", "FastAPI", "Docker"],
  },
  {
    num: "04",
    title: "Marketing Content Generator",
    client: "Enterprise Client",
    description:
      "GPT-4 powered content system with prompt-engineered templates. Reduced creative brief turnaround from 5 days to 8 hours for 40+ monthly requests with 85% brand approval rate.",
    impact: "5 days to 8 hours",
    stack: ["GPT-4", "Python", "FastAPI", "Prompt Engineering"],
  },
  {
    num: "05",
    title: "Automated Portfolio Manager",
    client: "HSBC",
    description:
      "Financial data consolidation system across 16 entities. Eliminated manual Excel workflows and reduced weekly report generation from 64 hours to 2 hours across 16 business lines.",
    impact: "97% time reduction",
    stack: ["Python", "Power Query", "Data Pipelines"],
  },
]

export function Projects() {
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
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
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
      id="projects"
      className="px-6 md:px-12 lg:px-24 py-28 md:py-36 bg-card"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
        <div>
          <p className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground mb-4">
            / 03
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-card-foreground">
            Selected Projects
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
          Production systems built for enterprise clients. Real impact, real scale.
        </p>
      </div>

      <div className="space-y-0">
        {projects.map((project) => (
          <div
            key={project.num}
            data-reveal
            className="opacity-0 group py-10 border-t border-border last:border-b transition-all duration-500"
          >
            <div className="flex flex-col lg:flex-row lg:gap-16">
              {/* Left: Metadata */}
              <div className="shrink-0 lg:w-64 mb-4 lg:mb-0">
                <div className="flex items-center gap-4 mb-3">
                  <span className="font-mono text-[11px] text-muted-foreground tracking-wide">
                    {project.num}
                  </span>
                  <span className="h-px flex-1 bg-border lg:hidden" />
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  {project.client}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] text-foreground bg-secondary px-3 py-1.5">
                  <ArrowUpRight className="h-3 w-3" />
                  {project.impact}
                </div>
              </div>

              {/* Right: Content */}
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-semibold text-card-foreground tracking-tight group-hover:text-card-foreground/80 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3 max-w-2xl">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-5">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-[10px] text-muted-foreground border border-border px-2.5 py-1 transition-colors duration-300 hover:text-foreground hover:border-muted-foreground tracking-wide"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
