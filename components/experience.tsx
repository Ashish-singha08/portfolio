"use client"

import { useEffect, useRef } from "react"

const experiences = [
  {
    period: "Aug 2023 -- Present",
    role: "GenAI Engineer",
    company: "Axtria Ingenious Insights",
    location: "Noida, India",
    highlights: [
      "Developed 5 production AI agents (document Q&A, web scraping, forecasting) deployed to 8 Fortune 500 clients as part of 13-member GenAI team that delivered $4M+ revenue in 2026",
      "Architected Unstructured Agent with multi-vector retrieval: Tantivy for keyword search, FAISS for Q&A pairs, Chroma for semantic search; intent classifier routes queries across 6 retrieval strategies",
      "Shipped enterprise chatbot serving 4,000+ India employees with 5,000+ monthly queries; React frontend, Flask API, RAG backend on AWS Lambda + OpenSearch + FAISS; 92% answer accuracy",
      "Created agent orchestration dashboard with CrewAI + LangChain — business users configure and deploy agents without code; 16 active deployments across scraping, reporting, analytics",
      "Integrated n8n workflow automation, creating 12 reusable sub-workflows; reduced manual tasks from 20 to 7 hrs/week per engineer (169 hours saved weekly across team)",
      "Built Marketing Content Generator using GPT-4; reduced creative brief turnaround from 5 days to 8 hours for 40+ monthly requests with 85% approval rate",
    ],
    technologies: ["Python", "LangChain", "CrewAI", "FastAPI", "Flask", "React", "FAISS", "Chroma", "Tantivy", "AWS Lambda", "OpenSearch", "Docker", "n8n"],
  },
  {
    period: "Jan 2023 -- Jul 2023",
    role: "Automation Engineering Intern",
    company: "HSBC",
    location: "Gurgaon, India",
    highlights: [
      "Automated 8 manual reporting workflows using Python and Power Query, reducing weekly execution time from 64 hours to 2 hours (97% reduction) across 16 business lines",
      "Developed Automated Portfolio Manager consolidating financial data across 16 entities, eliminating manual Excel work and reducing report generation time by 80%",
    ],
    technologies: ["Python", "Power Query", "Excel Automation", "Data Pipelines"],
  },
]

const education = [
  {
    period: "2021 -- 2023",
    degree: "M.Tech in Computer Science",
    institution: "IIIT Bangalore",
    location: "Bangalore, India",
  },
  {
    period: "2017 -- 2021",
    degree: "B.Tech in Information Technology",
    institution: "G.B. Pant University",
    location: "Pantnagar, India",
  },
]

export function Experience() {
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
      id="experience"
      className="px-6 md:px-12 lg:px-24 py-28 md:py-36 bg-card"
    >
      {/* Work Experience */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
        <div>
          <p className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground mb-4">
            / 02
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-card-foreground">
            Experience
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
          From automating bank operations at HSBC to building AI agents for Fortune 500 clients at Axtria.
        </p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[7px] top-0 bottom-0 w-px bg-border" />

        <div className="space-y-0">
          {experiences.map((exp, index) => (
            <div
              key={index}
              data-reveal
              className="opacity-0 group relative pl-10 md:pl-14 py-10 first:pt-0"
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-10 first:top-0 h-3.5 w-3.5 rounded-full border-2 border-muted-foreground bg-card group-hover:border-foreground group-hover:bg-foreground transition-all duration-300" />

              <div>
                <div className="flex flex-col md:flex-row md:items-baseline md:gap-4 mb-1">
                  <h3 className="text-xl font-semibold text-card-foreground tracking-tight">
                    {exp.role}
                  </h3>
                  <span className="font-mono text-[11px] text-muted-foreground tracking-wide">
                    {exp.period}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {exp.company} &mdash; {exp.location}
                </p>

                <ul className="mt-6 space-y-3">
                  {exp.highlights.map((h, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                      <span className="text-foreground/30 mt-0.5 shrink-0">&mdash;</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 mt-6">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-[10px] text-muted-foreground bg-secondary px-2.5 py-1 transition-colors duration-300 hover:text-foreground hover:bg-accent tracking-wide"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="mt-24 pt-16 border-t border-border">
        <h3
          data-reveal
          className="opacity-0 font-mono text-[11px] tracking-widest uppercase text-muted-foreground mb-10"
        >
          Education
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          {education.map((edu, index) => (
            <div
              key={index}
              data-reveal
              className="opacity-0 bg-card p-8"
            >
              <p className="font-mono text-[11px] text-muted-foreground tracking-wide mb-3">
                {edu.period}
              </p>
              <h4 className="text-base font-semibold text-card-foreground tracking-tight">
                {edu.degree}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {edu.institution}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {edu.location}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="mt-16 pt-16 border-t border-border">
        <h3
          data-reveal
          className="opacity-0 font-mono text-[11px] tracking-widest uppercase text-muted-foreground mb-10"
        >
          Recognition
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
          {[
            {
              title: "Top 1% Performer",
              detail: "Axtria 2026 — Ranked top 40 of 4,000+ employees",
            },
            {
              title: "GATE AIR 943",
              detail: "Computer Science 2021 — Top 1% of 90,000+ candidates",
            },
            {
              title: "DSA Educator",
              detail: "50+ sessions on Unacademy — 4.7/5 rating, 1,000+ students",
            },
          ].map((item, i) => (
            <div
              key={i}
              data-reveal
              className="opacity-0 bg-card p-8"
            >
              <h4 className="text-base font-semibold text-card-foreground tracking-tight">
                {item.title}
              </h4>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
