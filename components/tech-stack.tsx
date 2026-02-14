"use client"

import { useEffect, useRef } from "react"

const categories = [
  {
    label: "GenAI / LLM",
    items: [
      "LangChain",
      "CrewAI",
      "RAG Pipelines",
      "GPT-4",
      "Claude",
      "Prompt Engineering",
    ],
  },
  {
    label: "Vector & Search",
    items: [
      "FAISS",
      "Chroma",
      "Tantivy",
      "OpenSearch",
      "Elasticsearch",
      "Embeddings",
    ],
  },
  {
    label: "Backend",
    items: [
      "Python",
      "FastAPI",
      "Flask",
      "Django",
      "Java / Spring Boot",
      "Celery",
      "Redis",
    ],
  },
  {
    label: "Frontend",
    items: [
      "React",
      "Angular",
      "TypeScript",
      "JavaScript",
      "Next.js",
    ],
  },
  {
    label: "Databases",
    items: [
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Elasticsearch",
    ],
  },
  {
    label: "DevOps & Infra",
    items: [
      "Docker",
      "AWS (Lambda, S3, EC2)",
      "CI/CD",
      "Jenkins",
      "Ansible",
      "n8n",
    ],
  },
]

export function TechStack() {
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
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    )
    const items = sectionRef.current?.querySelectorAll("[data-reveal]")
    items?.forEach((el, i) => {
      const element = el as HTMLElement
      element.style.animationDelay = `${i * 60}ms`
      observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="stack"
      className="px-6 md:px-12 lg:px-24 py-28 md:py-36"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
        <div>
          <p className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground mb-4">
            / 04
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Technical Stack
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
          The tools and technologies I use to build production AI systems and scalable backends.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
        {categories.map((category) => (
          <div
            key={category.label}
            data-reveal
            className="opacity-0 bg-background p-8 md:p-10"
          >
            <h3 className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground mb-8 pb-4 border-b border-border">
              {category.label}
            </h3>
            <ul className="space-y-3.5">
              {category.items.map((item) => (
                <li
                  key={item}
                  className="text-sm text-foreground/80 font-medium flex items-center gap-3 group cursor-default hover:text-foreground transition-colors duration-300"
                >
                  <span className="h-px w-4 bg-muted-foreground group-hover:w-8 group-hover:bg-foreground transition-all duration-300" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
