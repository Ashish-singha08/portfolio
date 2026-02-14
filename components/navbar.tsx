"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

const navItems = [
  { label: "Expertise", href: "#expertise" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Stack", href: "#stack" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "#contact" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="flex items-center justify-between px-6 md:px-12 lg:px-24 h-16">
        <a
          href="#"
          className="font-mono text-sm font-semibold text-foreground tracking-tight hover:opacity-60 transition-opacity"
        >
          AS.
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isRoute = item.href.startsWith("/")
            const classes =
              "text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-widest uppercase"
            return (
              <li key={item.label}>
                {isRoute ? (
                  <Link href={item.href} className={classes}>
                    {item.label}
                  </Link>
                ) : (
                  <a href={item.href} className={classes}>
                    {item.label}
                  </a>
                )}
              </li>
            )
          })}
        </ul>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border">
          <ul className="flex flex-col py-6 px-6">
            {navItems.map((item, i) => {
              const isRoute = item.href.startsWith("/")
              const inner = (
                <>
                  <span className="font-mono text-xs text-muted-foreground w-6">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm tracking-wide">{item.label}</span>
                </>
              )
              const classes =
                "flex items-center gap-4 py-4 text-foreground transition-colors border-b border-border"
              return (
                <li key={item.label}>
                  {isRoute ? (
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={classes}
                    >
                      {inner}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={classes}
                    >
                      {inner}
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </header>
  )
}
