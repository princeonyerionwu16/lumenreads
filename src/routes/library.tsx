import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { BookMarked, CheckCircle2, Clock, Heart, Library as LibraryIcon, Trash2 } from "lucide-react";
import { useLibrary, type ShelfStatus } from "@/lib/library";
import { useFavorites } from "@/lib/favorites";
import { useAuth } from "@/lib/auth";
import { EmptyState } from "@/components/EmptyState";
import { toast } from "sonner";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "My Library — LumenReads" },
      { name: "description", content: "Your personal book library — Want to Read, Currently Reading, and Completed." },
    ],
  }),
  component: LibraryPage,
});

type Tab = ShelfStatus | "favorites";

const TABS: { id: Tab; label: string; icon: typeof Heart }[] = [
  { id: "want", label: "Want to Read", icon: BookMarked },
  { id: "reading", label: "Currently Reading", icon: Clock },
  { id: "completed", label: "Completed", icon: CheckCircle2 },
  { id: "favorites", label: "Favorites", icon: Heart },
];

function LibraryPage() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const { items, remove } = useLibrary();
  const { favorites } = useFavorites();
  const [tab, setTab] = useState<Tab>("want");

  useEffect(() => {
    if (ready && !user) navigate({ to: "/login" });
  }, [ready, user, navigate]);

  const visible = useMemo(() => {
    if (tab === "favorites") return favorites.map((f) => ({ ...f, status: "want" as ShelfStatus, addedAt: 0 }));
    return items.filter((i) => i.status === tab);
  }, [tab, items, favorites]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="size-12 rounded-2xl bg-[var(--gradient-primary)] grid place-items-center shadow-glow">
          <LibraryIcon className="size-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">Your Library</h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length + favorites.length} items across your shelves</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="mt-10 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {TABS.map((t) => {
          const count = t.id === "favorites" ? favorites.length : items.filter((i) => i.status === t.id).length;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap inline-flex items-center gap-2 transition-all hover:scale-105 ${
                active ? "text-primary-foreground" : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {active && (
                <motion.span layoutId="lib-tab" className="absolute inset-0 rounded-xl bg-[var(--gradient-primary)] shadow-glow" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
              )}
              <span className="relative inline-flex items-center gap-2">
                <t.icon className="size-4" /> {t.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? "bg-white/20" : "bg-secondary"}`}>{count}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-10">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
            {visible.length === 0 ? (
              <EmptyState title="Nothing here yet" description="Add books from the explore page to populate this shelf." />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {visible.map((b, i) => (
                  <motion.div key={b.id + tab}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.4) }}
                    className="group relative">
                    <Link to="/book/$id" params={{ id: b.id }}
                      className="block rounded-2xl overflow-hidden glass hover:shadow-glow transition-all duration-500 hover:-translate-y-1">
                      <div className="aspect-[2/3] overflow-hidden bg-secondary">
                        {b.thumbnail ? <img src={b.thumbnail} alt={b.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          : <div className="w-full h-full grid place-items-center text-xs text-muted-foreground">No cover</div>}
                      </div>
                      <div className="p-4">
                        <h3 className="font-display font-semibold line-clamp-2 leading-tight">{b.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{b.authors?.join(", ") || "Unknown"}</p>
                      </div>
                    </Link>
                    {tab !== "favorites" && (
                      <button
                        onClick={() => { remove(b.id); toast("Removed from shelf", { description: b.title }); }}
                        aria-label="Remove"
                        className="absolute top-3 right-3 size-9 rounded-full glass grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
