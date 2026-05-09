import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import { EmptyState } from "@/components/EmptyState";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Your Favorites — LumenReads" },
      { name: "description", content: "Your saved books, all in one place." },
    ],
  }),
  component: Favorites,
});

function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="size-12 rounded-2xl bg-[var(--gradient-primary)] grid place-items-center shadow-glow">
          <Heart className="size-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">Your Favorites</h1>
          <p className="text-muted-foreground text-sm mt-1">{favorites.length} {favorites.length === 1 ? "book" : "books"} saved</p>
        </div>
      </motion.div>

      <div className="mt-12">
        {favorites.length === 0 ? (
          <EmptyState title="No favorites yet" description="Tap the heart on any book to save it here for later." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {favorites.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.4) }}
              >
                <Link
                  to="/book/$id"
                  params={{ id: f.id }}
                  className="group block rounded-2xl overflow-hidden glass hover:shadow-glow transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="aspect-[2/3] overflow-hidden bg-secondary">
                    {f.thumbnail ? (
                      <img src={f.thumbnail} alt={f.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-muted-foreground text-xs">No cover</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-semibold line-clamp-2 leading-tight">{f.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{f.authors?.join(", ") || "Unknown"}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
