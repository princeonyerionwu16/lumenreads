import { useCallback, useEffect, useState } from "react";
import type { Book } from "./books";

const KEY = "lumenreads.library";
const RECENT_KEY = "lumenreads.recent";

export type ShelfStatus = "want" | "reading" | "completed";

export type LibraryItem = {
  id: string;
  title: string;
  authors?: string[];
  thumbnail?: string;
  publishedDate?: string;
  status: ShelfStatus;
  addedAt: number;
};

function read(): LibraryItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function emit() { window.dispatchEvent(new Event("library-updated")); }

export function useLibrary() {
  const [items, setItems] = useState<LibraryItem[]>([]);

  useEffect(() => {
    setItems(read());
    const refresh = () => setItems(read());
    window.addEventListener("library-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("library-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const setStatus = useCallback((book: Book, status: ShelfStatus) => {
    const cur = read();
    const idx = cur.findIndex((i) => i.id === book.id);
    const item: LibraryItem = {
      id: book.id,
      title: book.volumeInfo.title || "Untitled",
      authors: book.volumeInfo.authors,
      thumbnail: book.volumeInfo.imageLinks?.thumbnail?.replace(/^http:/, "https:"),
      publishedDate: book.volumeInfo.publishedDate,
      status,
      addedAt: Date.now(),
    };
    const next = idx >= 0 ? cur.map((i, k) => (k === idx ? { ...i, status } : i)) : [...cur, item];
    localStorage.setItem(KEY, JSON.stringify(next));
    emit();
  }, []);

  const remove = useCallback((id: string) => {
    const next = read().filter((i) => i.id !== id);
    localStorage.setItem(KEY, JSON.stringify(next));
    emit();
  }, []);

  const getStatus = useCallback((id: string): ShelfStatus | null => {
    return items.find((i) => i.id === id)?.status ?? null;
  }, [items]);

  return { items, setStatus, remove, getStatus };
}

// Recently viewed
export type RecentItem = {
  id: string;
  title: string;
  thumbnail?: string;
  authors?: string[];
  viewedAt: number;
};

export function pushRecent(book: Book) {
  if (typeof window === "undefined") return;
  const cur: RecentItem[] = (() => {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; }
  })();
  const filtered = cur.filter((r) => r.id !== book.id);
  const next: RecentItem[] = [{
    id: book.id,
    title: book.volumeInfo.title || "Untitled",
    authors: book.volumeInfo.authors,
    thumbnail: book.volumeInfo.imageLinks?.thumbnail?.replace(/^http:/, "https:"),
    viewedAt: Date.now(),
  }, ...filtered].slice(0, 12);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("recent-updated"));
}

export function useRecent() {
  const [items, setItems] = useState<RecentItem[]>([]);
  useEffect(() => {
    const refresh = () => {
      try { setItems(JSON.parse(localStorage.getItem(RECENT_KEY) || "[]")); } catch { setItems([]); }
    };
    refresh();
    window.addEventListener("recent-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("recent-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return items;
}
