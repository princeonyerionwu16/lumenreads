import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLeft, BookMarked, BookOpen, Building2, Calendar, CheckCircle2, ChevronDown, Clock, FileText, Globe, Heart, Star, Tag } from "lucide-react";
import { getBook, getCover } from "@/lib/books";
import { useFavorites } from "@/lib/favorites";
import { useLibrary, pushRecent, type ShelfStatus } from "@/lib/library";
import { toast } from "sonner";
import { BookRow } from "@/components/BookRow";

export const Route = createFileRoute("/book/$id")({
  component: BookDetail,
});

function BookDetail() {
  const { id } = Route.useParams();
  const router = useRouter();
  const { data: book, isLoading, isError } = useQuery({
    queryKey: ["book", id],
    queryFn: () => getBook(id),
  });
  const { isFav, toggle } = useFavorites();
  const { setStatus, getStatus, remove } = useLibrary();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => { if (book) pushRecent(book); }, [book]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 grid md:grid-cols-[300px_1fr] gap-10">
        <div className="aspect-[2/3] rounded-2xl bg-secondary shimmer" />
        <div className="space-y-4">
          <div className="h-10 w-3/4 rounded bg-secondary shimmer" />
          <div className="h-6 w-1/2 rounded bg-secondary shimmer" />
          <div className="h-32 rounded bg-secondary shimmer" />
        </div>
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-24 text-center">
        <h1 className="text-2xl font-display font-semibold">Book not found</h1>
        <Link to="/" className="mt-6 inline-block px-4 py-2 rounded-lg bg-primary text-primary-foreground">Back to discovery</Link>
      </div>
    );
  }

  const v = book.volumeInfo;
  const cover = getCover(book, "large");
  const fav = isFav(book.id);
  const stripHtml = (s?: string) => s?.replace(/<[^>]+>/g, "") ?? "";
  const description = stripHtml(v.description);
  const isLong = description.length > 480;

  const onFav = () => {
    const added = toggle(book);
    toast(added ? "Added to favorites" : "Removed from favorites", { description: v.title });
  };

  const relatedQuery = v.authors?.[0] ? `inauthor:${v.authors[0]}` : v.categories?.[0] ? `subject:${v.categories[0]}` : "bestsellers";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-16"
    >
      {/* Backdrop hero */}
      {cover && (
        <div aria-hidden className="absolute left-0 right-0 top-16 h-[480px] -z-10 overflow-hidden">
          <img src={cover} alt="" className="w-full h-full object-cover blur-3xl scale-110 opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background" />
        </div>
      )}

      <button
        onClick={() => router.history.back()}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
      >
        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" /> Back
      </button>

      <div className="grid md:grid-cols-[320px_1fr] gap-10 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-[var(--gradient-primary)] blur-3xl opacity-40 rounded-full animate-float" />
          <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-elegant glass">
            {cover ? (
              <img src={cover} alt={v.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center text-muted-foreground">No cover</div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {v.categories?.[0] && (
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{v.categories[0]}</p>
          )}
          <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight leading-tight">{v.title}</h1>
          {v.authors && (
            <p className="mt-3 text-lg text-muted-foreground">by <span className="text-foreground/90">{v.authors.join(", ")}</span></p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            {v.averageRating && (
              <Badge>
                <Star className="size-3.5 fill-accent text-accent" />
                <span className="font-medium">{v.averageRating}</span>
                {v.ratingsCount && <span className="text-muted-foreground">({v.ratingsCount})</span>}
              </Badge>
            )}
            {v.publishedDate && <Badge><Calendar className="size-3.5" /> {v.publishedDate}</Badge>}
            {v.pageCount && <Badge><FileText className="size-3.5" /> {v.pageCount} pages</Badge>}
            {v.language && <Badge><Globe className="size-3.5" /> {v.language.toUpperCase()}</Badge>}
            {v.categories?.slice(0, 2).map((c) => (
              <Badge key={c}><Tag className="size-3.5" /> {c}</Badge>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {v.previewLink && (
              <a
                href={v.previewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--gradient-primary)] text-primary-foreground font-medium shadow-glow hover:scale-[1.03] active:scale-95 transition-transform"
              >
                <BookOpen className="size-4" /> Preview / Read
              </a>
            )}
            <button
              onClick={onFav}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl glass font-medium hover:text-foreground hover:scale-[1.03] active:scale-95 transition-all"
            >
              <Heart className={`size-4 ${fav ? "fill-accent text-accent" : ""}`} />
              {fav ? "Saved" : "Save to favorites"}
            </button>
          </div>

          {/* Shelf picker */}
          <div className="mt-5 flex flex-wrap gap-2">
            {([
              { id: "want", label: "Want to Read", icon: BookMarked },
              { id: "reading", label: "Currently Reading", icon: Clock },
              { id: "completed", label: "Completed", icon: CheckCircle2 },
            ] as { id: ShelfStatus; label: string; icon: typeof Clock }[]).map((s) => {
              const active = getStatus(book.id) === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    if (active) { remove(book.id); toast("Removed from shelf", { description: v.title }); }
                    else { setStatus(book, s.id); toast(`Added to ${s.label}`, { description: v.title }); }
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 active:scale-95 ${
                    active ? "bg-[var(--gradient-primary)] text-primary-foreground shadow-glow" : "glass text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <s.icon className="size-4" /> {s.label}
                </button>
              );
            })}
          </div>


          {description && (
            <div className="mt-10">
              <h2 className="font-display text-xl font-semibold mb-3">About this book</h2>
              <AnimatePresence initial={false}>
                <motion.div
                  key={expanded ? "full" : "short"}
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  className={`text-muted-foreground leading-relaxed whitespace-pre-line ${!expanded && isLong ? "line-clamp-6" : ""}`}
                >
                  {description}
                </motion.div>
              </AnimatePresence>
              {isLong && (
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  {expanded ? "Show less" : "Read more"}
                  <ChevronDown className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
                </button>
              )}
            </div>
          )}

          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            {v.publisher && <DetailRow icon={Building2} label="Publisher" value={v.publisher} />}
            {v.language && <DetailRow icon={Globe} label="Language" value={v.language.toUpperCase()} />}
            {v.categories && <DetailRow icon={Tag} label="Categories" value={v.categories.join(", ")} />}
            {v.publishedDate && <DetailRow icon={Calendar} label="Published" value={v.publishedDate} />}
          </div>
        </motion.div>
      </div>

      <BookRow title="You might also like" subtitle="Related reads" query={relatedQuery} />
    </motion.div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-sm text-muted-foreground hover:text-foreground transition-colors">
      {children}
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl glass hover:shadow-glow transition-shadow">
      <Icon className="size-4 text-primary mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-sm font-medium mt-0.5 truncate">{value}</p>
      </div>
    </div>
  );
}
