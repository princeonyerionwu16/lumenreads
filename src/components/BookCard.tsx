import { Link } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Heart, Star, Eye, BookOpen } from "lucide-react";
import { type Book, getCover } from "@/lib/books";
import { useFavorites } from "@/lib/favorites";
import { toast } from "sonner";
import type { MouseEvent as ReactMouseEvent } from "react";

export function BookCard({ book, index = 0 }: { book: Book; index?: number }) {
  const { isFav, toggle } = useFavorites();
  const fav = isFav(book.id);
  const cover = getCover(book);
  const year = book.volumeInfo.publishedDate?.slice(0, 4);

  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });
  const rotateX = useTransform(rx, (v) => `${v}deg`);
  const rotateY = useTransform(ry, (v) => `${v}deg`);

  const onMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 10);
    rx.set(-py * 10);
  };
  const onLeave = () => { rx.set(0); ry.set(0); };

  const onFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggle(book);
    toast(added ? "Added to favorites" : "Removed from favorites", { description: book.volumeInfo.title });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.4) }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="will-change-transform"
    >
      <Link
        to="/book/$id"
        params={{ id: book.id }}
        className="group block relative rounded-2xl overflow-hidden glass hover:shadow-glow transition-all duration-500 hover:-translate-y-1"
      >
        <div className="relative aspect-[2/3] overflow-hidden bg-secondary">
          {cover ? (
            <img
              src={cover}
              alt={book.volumeInfo.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-muted-foreground text-xs px-4 text-center">No cover</div>
          )}

          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-90" />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3 gap-2">
            <button
              onClick={onFav}
              aria-label="Toggle favorite"
              className="size-9 rounded-full glass grid place-items-center hover:scale-110 active:scale-95 transition-transform"
            >
              <Heart className={`size-4 ${fav ? "fill-accent text-accent" : ""}`} />
            </button>
            {book.volumeInfo.previewLink && (
              <a
                href={book.volumeInfo.previewLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label="Preview"
                className="size-9 rounded-full glass grid place-items-center hover:scale-110 active:scale-95 transition-transform"
              >
                <Eye className="size-4" />
              </a>
            )}
            <span className="px-3 h-9 rounded-full bg-[var(--gradient-primary)] text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 hover:scale-105 transition-transform">
              <BookOpen className="size-3.5" /> Details
            </span>
          </div>

          {/* Persistent fav button (mobile) */}
          <button
            onClick={onFav}
            aria-label="Toggle favorite"
            className="md:hidden absolute top-3 right-3 size-9 rounded-full glass grid place-items-center"
          >
            <Heart className={`size-4 ${fav ? "fill-accent text-accent" : ""}`} />
          </button>

          {book.volumeInfo.averageRating && (
            <div className="absolute top-3 left-3 px-2 py-1 rounded-full glass flex items-center gap-1 text-xs font-medium">
              <Star className="size-3 fill-accent text-accent" />
              {book.volumeInfo.averageRating}
            </div>
          )}
        </div>

        <div className="p-4 -mt-12 relative">
          <h3 className="font-display font-semibold line-clamp-2 leading-tight">{book.volumeInfo.title}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{book.volumeInfo.authors?.join(", ") || "Unknown author"}</p>
          {year && <p className="text-xs text-muted-foreground mt-2">{year}</p>}
        </div>
      </Link>
    </motion.div>
  );
}
