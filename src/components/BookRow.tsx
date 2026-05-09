import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { searchBooks } from "@/lib/books";
import { BookCard } from "./BookCard";

export function BookRow({ title, query, subtitle }: { title: string; query: string; subtitle?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["row", query],
    queryFn: () => searchBooks({ q: query, maxResults: 14 }),
    staleTime: 5 * 60_000,
  });

  const scroll = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="mt-14"
    >
      <div className="flex items-end justify-between mb-5 px-1">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className="hidden sm:flex gap-2">
          <button onClick={() => scroll(-1)} aria-label="Scroll left" className="size-10 rounded-xl glass grid place-items-center hover:scale-110 hover:shadow-glow transition-all">
            <ChevronLeft className="size-5" />
          </button>
          <button onClick={() => scroll(1)} aria-label="Scroll right" className="size-10 rounded-xl glass grid place-items-center hover:scale-110 hover:shadow-glow transition-all">
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="shrink-0 w-[160px] sm:w-[180px] snap-start">
                <div className="aspect-[2/3] rounded-2xl bg-secondary shimmer" />
                <div className="h-4 mt-3 rounded bg-secondary shimmer" />
                <div className="h-3 mt-2 w-2/3 rounded bg-secondary shimmer" />
              </div>
            ))
          : data?.items?.map((b, i) => (
              <div key={b.id} className="shrink-0 w-[160px] sm:w-[180px] snap-start">
                <BookCard book={b} index={i} />
              </div>
            ))}
      </div>
    </motion.section>
  );
}
