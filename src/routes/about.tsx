import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookOpen, Heart, Sparkles, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — LumenReads" },
      { name: "description", content: "LumenReads is a modern reading platform helping readers discover and track books they love." },
      { property: "og:title", content: "About — LumenReads" },
      { property: "og:description", content: "A modern reading platform built for the way people read today." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-muted-foreground mb-6">
          <Sparkles className="size-3 text-primary" />
          About LumenReads
        </div>
        <h1 className="text-4xl sm:text-6xl font-display font-bold tracking-tight">
          A reading life, <span className="gradient-text">beautifully crafted.</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          LumenReads is a modern reading companion that helps you discover, organize, and track
          millions of books — all in one beautifully designed place.
        </p>
      </motion.div>

      <div className="mt-16 grid sm:grid-cols-3 gap-5">
        {[
          { icon: BookOpen, title: "Discover", text: "Explore millions of titles powered by Google Books." },
          { icon: Heart, title: "Save", text: "Build favorites and personal shelves you actually use." },
          { icon: Users, title: "Connect", text: "Join a community of curious, lifelong readers." },
        ].map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-3xl glass"
          >
            <div className="size-12 rounded-2xl bg-[var(--gradient-primary)] grid place-items-center shadow-glow">
              <c.icon className="size-5 text-primary-foreground" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold">{c.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{c.text}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 p-8 rounded-3xl glass">
        <h2 className="font-display text-2xl font-semibold">Built with care</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          LumenReads is built with React, Tailwind CSS, Framer Motion, and the Google Books API.
          Every interaction is designed to feel quick, considered, and quietly delightful.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/explore" className="px-5 py-2.5 rounded-xl bg-[var(--gradient-primary)] text-primary-foreground font-medium hover:scale-105 transition-transform">
            Start exploring
          </Link>
          <Link to="/register" className="px-5 py-2.5 rounded-xl glass font-medium hover:scale-105 transition-transform">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
