import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { searchBooks, CATEGORIES } from "@/lib/books";
import { BookCard } from "@/components/BookCard";
import { BookGridSkeleton } from "@/components/BookGridSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { SearchBar } from "@/components/SearchBar";
import { BookRow } from "@/components/BookRow";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Books — LumenReads" },
      { name: "description", content: "Search and discover millions of books by title, author, or keyword." },
      { property: "og:title", content: "Explore Books — LumenReads" },
      { property: "og:description", content: "Search and discover millions of books." },
    ],
  }),
  component: Explore,
});

function Explore() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const isSearching = submitted.trim().length > 0 || category !== "All";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["books", submitted, category, page],
    queryFn: () => searchBooks({ q: submitted || "bestsellers", category, startIndex: page * pageSize, maxResults: pageSize }),
    enabled: isSearching,
  });

  const onSubmit = (q: string) => { setPage(0); setSubmitted(q); };
  const totalPages = Math.min(Math.ceil((data?.totalItems ?? 0) / pageSize), 50);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-3xl mx-auto relative"
      >
        <div className="absolute inset-x-0 -top-10 h-64 bg-[var(--gradient-radial)] blur-2xl -z-10" />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-muted-foreground mb-6">
          <Sparkles className="size-3 text-primary" />
          Powered by Google Books
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight relative">
          Find your next <span className="gradient-text">obsession</span>
        </h1>
        <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
          Search millions of titles. Bookmark your favorites. Build a reading life you love.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-10"
      >
        <SearchBar value={query} onChange={setQuery} onSubmit={onSubmit} />
      </motion.div>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-start sm:justify-center">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => { setCategory(c); setPage(0); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all hover:scale-105 active:scale-95 ${
              category === c
                ? "bg-foreground text-background shadow-elegant"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-12">
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {isLoading ? (
                <BookGridSkeleton />
              ) : isError ? (
                <EmptyState title="Something went wrong" description="We couldn't reach the library. Please try again." />
              ) : !data?.items.length ? (
                <EmptyState />
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {data.items.map((book, i) => (
                      <BookCard key={book.id} book={book} index={i} />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-2">
                      <button
                        onClick={() => { setPage((p) => Math.max(0, p - 1)); window.scrollTo({ top: 300, behavior: "smooth" }); }}
                        disabled={page === 0}
                        className="px-4 py-2 rounded-lg glass text-sm font-medium disabled:opacity-40 hover:text-foreground hover:scale-105 transition-all"
                      >
                        Previous
                      </button>
                      <span className="px-4 py-2 text-sm text-muted-foreground">
                        Page {page + 1} of {totalPages}
                      </span>
                      <button
                        onClick={() => { setPage((p) => p + 1); window.scrollTo({ top: 300, behavior: "smooth" }); }}
                        disabled={page + 1 >= totalPages}
                        className="px-4 py-2 rounded-lg glass text-sm font-medium disabled:opacity-40 hover:text-foreground hover:scale-105 transition-all"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          ) : (
            <motion.div key="discover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <BookRow title="Trending Now" subtitle="What readers are obsessing over" query="bestsellers 2024" />
              <BookRow title="Popular Fiction" subtitle="Stories that linger long after the last page" query="subject:fiction" />
              <BookRow title="Romance" subtitle="Love in every chapter" query="subject:romance" />
              <BookRow title="Technology" subtitle="Build, code, and shape the future" query="subject:technology" />
              <BookRow title="Science" subtitle="The universe, decoded" query="subject:science" />
              <BookRow title="Biography" subtitle="Lives worth knowing" query="subject:biography" />
              <BookRow title="New Releases" subtitle="Fresh from the press" query="new releases 2025" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
