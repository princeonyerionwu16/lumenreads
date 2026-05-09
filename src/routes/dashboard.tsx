import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { BookMarked, BookOpen, CheckCircle2, Clock, Heart, Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import { useAuth, getInitials } from "@/lib/auth";
import { useLibrary, useRecent } from "@/lib/library";
import { useFavorites } from "@/lib/favorites";
import { BookRow } from "@/components/BookRow";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — LumenReads" },
      { name: "description", content: "Your personal reading dashboard." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const { items } = useLibrary();
  const { favorites } = useFavorites();
  const recent = useRecent();

  useEffect(() => {
    if (ready && !user) navigate({ to: "/login" });
  }, [ready, user, navigate]);

  if (!user) return null;

  const reading = items.filter((i) => i.status === "reading");
  const completed = items.filter((i) => i.status === "completed");
  const want = items.filter((i) => i.status === "want");

  const greet = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  const stats = [
    { icon: BookMarked, label: "Saved", value: items.length, color: "from-violet-500 to-fuchsia-500" },
    { icon: CheckCircle2, label: "Completed", value: completed.length, color: "from-emerald-500 to-sky-500" },
    { icon: Clock, label: "Currently reading", value: reading.length, color: "from-amber-500 to-rose-500" },
    { icon: Heart, label: "Favorites", value: favorites.length, color: "from-rose-500 to-pink-500" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-20">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-5">
        <div className="size-16 rounded-2xl bg-[var(--gradient-primary)] grid place-items-center text-2xl font-display font-bold text-primary-foreground shadow-glow">
          {getInitials(user.name)}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{greet},</p>
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">{user.name.split(" ")[0]}.</h1>
        </div>
        <div className="ml-auto hidden sm:flex items-center gap-2">
          <Link to="/explore" className="px-4 py-2 rounded-xl glass text-sm font-medium hover:scale-105 transition-transform inline-flex items-center gap-2">
            <Sparkles className="size-4" /> Discover more
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="relative p-5 rounded-2xl glass overflow-hidden hover:shadow-glow transition-all">
            <div className={`absolute -top-8 -right-8 size-24 rounded-full bg-gradient-to-br ${s.color} opacity-20 blur-2xl`} />
            <s.icon className="size-5 text-primary" />
            <p className="mt-3 text-3xl font-display font-bold">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Continue reading */}
      <Section title="Continue reading" subtitle="Pick up where you left off">
        {reading.length === 0 ? (
          <EmptyShelf
            text="You're not reading anything yet."
            cta="Find your next read"
            to="/explore"
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {reading.slice(0, 5).map((b) => <ShelfCard key={b.id} item={b} progress />)}
          </div>
        )}
      </Section>

      {/* Recently viewed */}
      {recent.length > 0 && (
        <Section title="Recently viewed" subtitle="Books you peeked at lately">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {recent.slice(0, 6).map((r) => (
              <Link key={r.id} to="/book/$id" params={{ id: r.id }}
                className="group block rounded-2xl overflow-hidden glass hover:shadow-glow hover:-translate-y-1 transition-all">
                <div className="aspect-[2/3] bg-secondary overflow-hidden">
                  {r.thumbnail ? <img src={r.thumbnail} alt={r.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    : <div className="w-full h-full grid place-items-center text-xs text-muted-foreground">No cover</div>}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium line-clamp-2 leading-tight">{r.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* Recommendations */}
      <BookRow title="Recommended for you" subtitle="Hand-picked based on what readers love" query="bestsellers" />
      <BookRow title="Trending in fiction" subtitle="What everyone's talking about" query="subject:fiction bestseller" />

      {/* Favorite categories */}
      <Section title="Favorite categories" subtitle="Jump into a genre">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {["Fiction", "Romance", "Science", "Technology", "Biography", "Fantasy"].map((c, i) => (
            <Link key={c} to="/explore"
              className="group p-5 rounded-2xl glass hover:shadow-glow hover:-translate-y-1 transition-all"
              style={{ background: GRADIENTS[i % GRADIENTS.length] }}>
              <TrendingUp className="size-5 text-white/90" />
              <p className="mt-6 font-display text-lg font-semibold text-white">{c}</p>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}

const GRADIENTS = [
  "linear-gradient(135deg,#7c3aed,#ec4899)",
  "linear-gradient(135deg,#0ea5e9,#6366f1)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
  "linear-gradient(135deg,#10b981,#0ea5e9)",
  "linear-gradient(135deg,#ec4899,#f43f5e)",
  "linear-gradient(135deg,#6366f1,#a855f7)",
];

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
      className="mt-14">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
      </div>
      {children}
    </motion.section>
  );
}

function ShelfCard({ item, progress }: { item: { id: string; title: string; thumbnail?: string; authors?: string[] }; progress?: boolean }) {
  return (
    <Link to="/book/$id" params={{ id: item.id }}
      className="group block rounded-2xl overflow-hidden glass hover:shadow-glow hover:-translate-y-1 transition-all">
      <div className="aspect-[2/3] bg-secondary overflow-hidden relative">
        {item.thumbnail ? <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          : <div className="w-full h-full grid place-items-center text-xs text-muted-foreground">No cover</div>}
        {progress && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-background/40">
            <div className="h-full bg-[var(--gradient-primary)]" style={{ width: `${20 + ((item.id.charCodeAt(0) || 0) % 60)}%` }} />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold line-clamp-2 leading-tight">{item.title}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{item.authors?.join(", ") || "Unknown author"}</p>
      </div>
    </Link>
  );
}

function EmptyShelf({ text, cta, to }: { text: string; cta: string; to: "/explore" | "/library" }) {
  return (
    <div className="p-10 rounded-3xl glass text-center">
      <BookOpen className="size-10 text-primary mx-auto" />
      <p className="mt-4 text-muted-foreground">{text}</p>
      <Link to={to} className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--gradient-primary)] text-primary-foreground font-medium hover:scale-105 transition-transform">
        {cta} <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
