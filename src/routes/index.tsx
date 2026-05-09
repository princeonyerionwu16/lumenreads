import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Search, Library, Heart, BookMarked, Sparkles, Eye,
  ArrowRight, Star, Quote, BookOpen, Zap, Globe2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LumenReads — Discover books that shape your imagination" },
      { name: "description", content: "A modern reading platform to discover, save, and track millions of books. Build a reading life you love." },
      { property: "og:title", content: "LumenReads — Discover books that shape your imagination" },
      { property: "og:description", content: "Discover, save, and track millions of books in one beautiful place." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative">
      <Hero />
      <Features />
      <Stats />
      <Testimonials />
      <CTA />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 sm:pt-24 pb-24">
      {/* Floating book elements */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-20 left-[8%] size-24 rounded-2xl bg-gradient-to-br from-primary/40 to-accent/30 blur-2xl animate-float" />
        <div className="absolute top-40 right-[10%] size-32 rounded-3xl bg-gradient-to-br from-accent/40 to-primary/20 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
        <div className="absolute bottom-10 left-[20%] size-40 rounded-full bg-primary/20 blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground"
        >
          <Sparkles className="size-3.5 text-primary" />
          The modern reading companion
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-7 text-5xl sm:text-7xl lg:text-8xl font-display font-bold tracking-tight leading-[1.05]"
        >
          Discover books that <br className="hidden sm:block" />
          shape your <span className="relative inline-block">
            <span className="absolute inset-0 blur-3xl opacity-50 gradient-text" aria-hidden>imagination.</span>
            <span className="gradient-text">imagination.</span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-7 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Search millions of titles, build your personal library, and track every page —
          in one beautifully crafted reading platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            to="/explore"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[var(--gradient-primary)] text-primary-foreground font-medium shadow-glow hover:scale-[1.04] active:scale-95 transition-transform"
          >
            Explore Books <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl glass font-medium hover:scale-[1.04] active:scale-95 transition-transform"
          >
            <BookOpen className="size-4" /> Start Reading
          </Link>
        </motion.div>

        {/* Floating book covers preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mt-20 relative max-w-5xl mx-auto"
        >
          <div className="absolute inset-x-10 -inset-y-10 bg-[var(--gradient-primary)] blur-3xl opacity-30 rounded-full" />
          <div className="relative glass rounded-3xl p-6 sm:p-10 shadow-elegant">
            <div className="flex items-center gap-3 sm:gap-5 justify-center flex-wrap">
              {HERO_BOOKS.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 30, rotate: i % 2 === 0 ? -8 : 8 }}
                  animate={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -4 : 4 }}
                  transition={{ delay: 0.7 + i * 0.08, duration: 0.6 }}
                  whileHover={{ y: -10, rotate: 0, scale: 1.08 }}
                  className="w-[110px] sm:w-[140px] aspect-[2/3] rounded-xl overflow-hidden shadow-elegant shrink-0"
                  style={{ background: b.color }}
                >
                  <div className="w-full h-full flex flex-col justify-between p-3 text-white/90">
                    <Sparkles className="size-4" />
                    <div>
                      <p className="text-[11px] uppercase tracking-wider opacity-70">{b.genre}</p>
                      <p className="text-sm font-display font-semibold leading-tight mt-1">{b.title}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const HERO_BOOKS = [
  { title: "The Quiet Forest", genre: "Fiction", color: "linear-gradient(135deg,#7c3aed,#ec4899)" },
  { title: "Atomic Mind", genre: "Self-Help", color: "linear-gradient(135deg,#0ea5e9,#6366f1)" },
  { title: "Stardust Code", genre: "Sci-Fi", color: "linear-gradient(135deg,#f59e0b,#ef4444)" },
  { title: "Lover's Library", genre: "Romance", color: "linear-gradient(135deg,#ec4899,#f43f5e)" },
  { title: "Deep Future", genre: "Tech", color: "linear-gradient(135deg,#10b981,#0ea5e9)" },
];

const FEATURES = [
  { icon: Search, title: "Smart Search", desc: "Real-time suggestions, history, and trending queries — find any book in seconds." },
  { icon: Library, title: "Personalized Library", desc: "Organize your shelves: Want to Read, Currently Reading, and Completed." },
  { icon: Heart, title: "Favorites", desc: "Bookmark beloved titles and revisit them anytime, anywhere." },
  { icon: BookMarked, title: "Reading Tracking", desc: "Track your reading progress and watch your stats grow over time." },
  { icon: Sparkles, title: "AI Recommendations", desc: "Curated picks based on what you've loved and what's trending." },
  { icon: Eye, title: "Book Preview", desc: "Read sample pages and dive into stories before you commit." },
];

function Features() {
  return (
    <section className="relative py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl sm:text-5xl font-bold tracking-tight"
          >
            Everything you need to <span className="gradient-text">read more.</span>
          </motion.h2>
          <p className="mt-4 text-muted-foreground text-lg">A complete platform for the modern reader.</p>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative p-7 rounded-3xl glass overflow-hidden hover:shadow-glow transition-all"
            >
              <div className="absolute -top-10 -right-10 size-32 rounded-full bg-[var(--gradient-primary)] opacity-0 group-hover:opacity-30 blur-3xl transition-opacity" />
              <div className="relative">
                <div className="size-12 rounded-2xl bg-[var(--gradient-primary)] grid place-items-center shadow-glow group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  <f.icon className="size-5 text-primary-foreground" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STATS = [
  { value: 1_000_000, suffix: "+", label: "Books discovered", icon: BookOpen },
  { value: 500_000, suffix: "+", label: "Active readers", icon: Globe2 },
  { value: 50, suffix: "+", label: "Categories", icon: Zap },
  { value: 100_000, suffix: "+", label: "Saved favorites", icon: Heart },
];

function Stats() {
  return (
    <section className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="glass rounded-3xl p-8 sm:p-12 shadow-elegant">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="size-12 mx-auto rounded-2xl bg-[var(--gradient-primary)] grid place-items-center shadow-glow">
                  <s.icon className="size-5 text-primary-foreground" />
                </div>
                <p className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight">
                  <Counter to={s.value} />{s.suffix}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Counter({ to, duration = 1800 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  const fmt = val >= 1_000_000 ? `${(val / 1_000_000).toFixed(val >= 10_000_000 ? 0 : 1)}M`
    : val >= 1000 ? `${Math.floor(val / 1000)}K`
    : `${val}`;
  return <span ref={ref}>{fmt}</span>;
}

const TESTIMONIALS = [
  { name: "Amelia R.", role: "Book Club Lead", quote: "LumenReads turned my reading habit into a real life. The library tabs are perfect.", color: "from-violet-500 to-fuchsia-500" },
  { name: "Daniel K.", role: "Software Engineer", quote: "Stunning UI, lightning-fast search, and the recommendations always nail it.", color: "from-sky-500 to-indigo-500" },
  { name: "Priya S.", role: "Literature Student", quote: "I discover three new books a week here. It feels like Spotify for readers.", color: "from-rose-500 to-orange-500" },
];

function Testimonials() {
  return (
    <section className="relative py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
            Loved by <span className="gradient-text">readers everywhere.</span>
          </motion.h2>
          <p className="mt-4 text-muted-foreground text-lg">Stories from people building their reading life with us.</p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="p-7 rounded-3xl glass hover:shadow-glow transition-all"
            >
              <Quote className="size-6 text-primary opacity-70" />
              <p className="mt-4 text-foreground/90 leading-relaxed">{t.quote}</p>
              <div className="mt-6 flex items-center gap-3">
                <div className={`size-11 rounded-full bg-gradient-to-br ${t.color} grid place-items-center text-white font-display font-semibold`}>
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="size-3.5 fill-accent text-accent" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl glass p-10 sm:p-16 text-center shadow-elegant"
        >
          <div aria-hidden className="absolute inset-0 -z-10">
            <div className="absolute -top-20 -left-20 size-72 rounded-full bg-primary/40 blur-3xl animate-float" />
            <div className="absolute -bottom-20 -right-20 size-72 rounded-full bg-accent/40 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          </div>
          <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight">
            Your next great read is <span className="gradient-text">one click away.</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto">
            Join LumenReads today and turn every page into a memory worth keeping.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[var(--gradient-primary)] text-primary-foreground font-medium shadow-glow hover:scale-[1.04] active:scale-95 transition-transform"
            >
              Get started — free <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl glass font-medium hover:scale-[1.04] active:scale-95 transition-transform"
            >
              Browse the library
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
