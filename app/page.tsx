import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Expertise } from "@/components/expertise"
import { Experience } from "@/components/experience"
import { Projects } from "@/components/projects"
import { TechStack } from "@/components/tech-stack"
import { Insights } from "@/components/insights"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
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
