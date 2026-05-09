import { Link } from "@tanstack/react-router";
import { BookOpen, Github, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="size-9 rounded-xl bg-[var(--gradient-primary)] grid place-items-center shadow-glow">
                <BookOpen className="size-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg">Lumen<span className="gradient-text">Reads</span></span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              A modern reading platform to discover, save, and track books you love.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[
                { Icon: Github, href: "https://github.com" },
                { Icon: Twitter, href: "#" },
                { Icon: Linkedin, href: "#" },
                { Icon: Mail, href: "mailto:hello@lumenreads.app" },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                  className="size-9 rounded-xl glass grid place-items-center text-muted-foreground hover:text-foreground hover:scale-110 transition-all">
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Product" links={[
            { to: "/explore", label: "Explore" },
            { to: "/library", label: "Library" },
            { to: "/favorites", label: "Favorites" },
            { to: "/dashboard", label: "Dashboard" },
          ]} />

          <FooterCol title="Company" links={[
            { to: "/about", label: "About" },
            { to: "/about", label: "Features" },
            { to: "/about", label: "Contact" },
          ]} />

          <div>
            <h4 className="font-display font-semibold">Get the newsletter</h4>
            <p className="text-sm text-muted-foreground mt-2">Curated reads, monthly. No spam.</p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-4 flex gap-2">
              <input type="email" placeholder="you@example.com"
                className="flex-1 px-4 py-2.5 rounded-xl glass text-sm outline-none focus:ring-2 focus:ring-primary/60" />
              <button className="px-4 py-2.5 rounded-xl bg-[var(--gradient-primary)] text-primary-foreground text-sm font-medium hover:scale-105 transition-transform">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} LumenReads. Built with React & the Google Books API.</p>
          <p className="text-xs text-muted-foreground">Crafted with care for readers everywhere.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: "/explore" | "/library" | "/favorites" | "/dashboard" | "/about"; label: string }[] }) {
  return (
    <div>
      <h4 className="font-display font-semibold">{title}</h4>
      <ul className="mt-4 space-y-2">
        {links.map((l, i) => (
          <li key={i}>
            <Link to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
