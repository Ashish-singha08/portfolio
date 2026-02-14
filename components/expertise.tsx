"use client"

import { useEffect, useRef } from "react"
import { Bot, Database, Cpu, Workflow, Code2 } from "lucide-react"

const expertise = [
  {
    icon: Bot,
    title: "Multi-Agent Systems",
    description:
      "Architecting autonomous agent orchestration with CrewAI and LangChain. Built 5 production agents (document Q&A, web scraping, forecasting) deployed across 8 Fortune 500 clients.",
    metrics: "16 active deployments",
    num: "01",
  },
  {
    icon: Database,
    title: "RAG & Retrieval Architecture",
    description:
      "Designing multi-vector retrieval pipelines with Tantivy for keyword search, FAISS for Q&A pairs, and Chroma for semantic search. Intent classifiers route queries across 6 retrieval strategies.",
    metrics: "92% answer accuracy",
    num: "02",
  },
  {
    icon: Cpu,
    title: "Production AI Infrastructure",
    description:
      "Shipping enterprise-grade AI systems on AWS Lambda, OpenSearch, and containerized microservices. Building chatbots handling 5,000+ monthly queries for 4,000+ users.",
    metrics: "5,000+ monthly queries",
    num: "03",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description:
      "Integrating n8n workflow automation with 12 reusable sub-workflows. Reduced repetitive tasks from 20 to 7 hours per week per engineer — 169 hours saved weekly across 13 engineers.",
    metrics: "169 hrs saved / week",
    num: "04",
  },
  {
    icon: Code2,
    title: "Full-Stack Engineering",
    description:
      "Building end-to-end with Python (FastAPI, Flask, Django), React/Angular frontends, and Java Spring Boot backends. PostgreSQL, Redis, Docker, and CI/CD pipelines.",
    metrics: "8+ enterprise systems",
    num: "05",
  },
]

export function Expertise() {
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
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
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
      id="expertise"
      className="px-6 md:px-12 lg:px-24 py-28 md:py-36"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
        <div>
          <p className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground mb-4">
            / 01
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Core Expertise
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
          Deep specializations in AI engineering, retrieval systems, and production infrastructure.
        </p>
      </div>

      <div className="space-y-0">
        {expertise.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.num}
              data-reveal
              className="opacity-0 group flex flex-col md:flex-row md:items-start gap-5 md:gap-10 py-9 md:py-10 border-t border-border last:border-b cursor-default transition-all duration-500 hover:pl-2 md:hover:pl-4"
            >
              <div className="flex items-center gap-4 shrink-0 md:w-12">
                <span className="font-mono text-[11px] text-muted-foreground tracking-wide">
                  {item.num}
                </span>
                <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300 hidden md:block" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-6">
                  <h3 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight group-hover:text-foreground/80 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <span className="font-mono text-[11px] text-muted-foreground tracking-wide uppercase shrink-0">
                    {item.metrics}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3 max-w-2xl">
                  {item.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
