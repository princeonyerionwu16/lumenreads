import { useEffect, useRef, useState } from "react";
import { Search, Clock, TrendingUp, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { searchBooks, getCover } from "@/lib/books";
import { useDebounce } from "@/hooks/useDebounce";
import { getHistory, pushHistory, clearHistory, TRENDING } from "@/lib/searchHistory";
import { Link } from "@tanstack/react-router";

export function SearchBar({ value, onChange, onSubmit }: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const debounced = useDebounce(value, 350);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const refresh = () => setHistory(getHistory());
    refresh();
    window.addEventListener("search-history-updated", refresh);
    return () => window.removeEventListener("search-history-updated", refresh);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const { data, isFetching } = useQuery({
    queryKey: ["suggest", debounced],
    queryFn: () => searchBooks({ q: debounced, maxResults: 6 }),
    enabled: debounced.trim().length >= 2 && open,
    staleTime: 60_000,
  });

  const submit = (q: string) => {
    pushHistory(q);
    onSubmit(q);
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className="relative max-w-2xl mx-auto">
      <form
        onSubmit={(e) => { e.preventDefault(); submit(value.trim() || "bestsellers"); }}
        className="relative group"
      >
        <div className="absolute inset-0 bg-[var(--gradient-primary)] rounded-2xl blur-xl opacity-30 group-focus-within:opacity-70 transition-opacity duration-500" />
        <div className="relative flex items-center glass rounded-2xl pl-5 pr-2 py-2 ring-0 group-focus-within:ring-2 group-focus-within:ring-primary/50 transition-all">
          <Search className="size-5 text-muted-foreground shrink-0" />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setOpen(true)}
            placeholder="Search by title, author, or keyword..."
            className="flex-1 bg-transparent border-0 outline-none px-3 py-2.5 text-base placeholder:text-muted-foreground"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Clear"
              className="size-8 rounded-lg grid place-items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="size-4" />
            </button>
          )}
          {isFetching && <Loader2 className="size-4 mr-2 animate-spin text-muted-foreground" />}
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[var(--gradient-primary)] text-primary-foreground font-medium text-sm hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all shadow-glow"
          >
            Search
          </button>
        </div>
      </form>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 mt-3 z-50 glass rounded-2xl overflow-hidden shadow-elegant max-h-[60vh] overflow-y-auto"
          >
            {debounced.trim().length >= 2 && data?.items?.length ? (
              <div className="p-2">
                <p className="px-3 py-2 text-xs uppercase tracking-wider text-muted-foreground">Suggestions</p>
                {data.items.slice(0, 6).map((b) => {
                  const cover = getCover(b);
                  return (
                    <Link
                      key={b.id}
                      to="/book/$id"
                      params={{ id: b.id }}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-secondary/60 transition-colors"
                    >
                      <div className="w-9 h-12 rounded bg-secondary overflow-hidden shrink-0">
                        {cover && <img src={cover} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{b.volumeInfo.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{b.volumeInfo.authors?.join(", ") || "Unknown"}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="p-2">
                {history.length > 0 && (
                  <div className="mb-1">
                    <div className="px-3 py-2 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Clock className="size-3" /> Recent</span>
                      <button onClick={clearHistory} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Clear</button>
                    </div>
                    {history.map((h) => (
                      <button
                        key={h}
                        onClick={() => { onChange(h); submit(h); }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-secondary/60 transition-colors text-sm"
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                )}
                <div>
                  <p className="px-3 py-2 text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><TrendingUp className="size-3" /> Trending</p>
                  <div className="flex flex-wrap gap-2 px-3 pb-3">
                    {TRENDING.map((t) => (
                      <button
                        key={t}
                        onClick={() => { onChange(t); submit(t); }}
                        className="px-3 py-1.5 rounded-full text-xs glass hover:text-foreground hover:scale-105 transition-all"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
