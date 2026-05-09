import { useEffect, useState, useCallback } from "react";
import type { Book } from "./books";

const KEY = "bookfinder.favorites";

type StoredFav = {
  id: string;
  title: string;
  authors?: string[];
  thumbnail?: string;
  publishedDate?: string;
};

function read(): StoredFav[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function useFavorites() {
  const [favs, setFavs] = useState<StoredFav[]>([]);

  useEffect(() => {
    setFavs(read());
    const onStorage = () => setFavs(read());
    window.addEventListener("storage", onStorage);
    window.addEventListener("favorites-updated", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("favorites-updated", onStorage);
    };
  }, []);

  const isFav = useCallback((id: string) => favs.some(f => f.id === id), [favs]);

  const toggle = useCallback((book: Book) => {
    const current = read();
    const exists = current.some(f => f.id === book.id);
    let updated: StoredFav[];
    if (exists) {
      updated = current.filter(f => f.id !== book.id);
    } else {
      updated = [...current, {
        id: book.id,
        title: book.volumeInfo.title || "Untitled",
        authors: book.volumeInfo.authors,
        thumbnail: book.volumeInfo.imageLinks?.thumbnail?.replace(/^http:/, "https:"),
        publishedDate: book.volumeInfo.publishedDate,
      }];
    }
    localStorage.setItem(KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("favorites-updated"));
    return !exists;
  }, []);

  return { favorites: favs, isFav, toggle };
}
