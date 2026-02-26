import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { AskCTA } from "@/components/ask-cta"
import { Expertise } from "@/components/expertise"
import { Experience } from "@/components/experience"
import { Projects } from "@/components/projects"
import { TechStack } from "@/components/tech-stack"
import { Insights } from "@/components/insights"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <AskCTA />
        <Expertise />
        <Experience />
        <Projects />
        <TechStack />
        <Insights />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
