export type Book = {
  id: string;
  volumeInfo: {
    title?: string;
    authors?: string[];
    publishedDate?: string;
    description?: string;
    publisher?: string;
    categories?: string[];
    pageCount?: number;
    language?: string;
    averageRating?: number;
    ratingsCount?: number;
    imageLinks?: { thumbnail?: string; smallThumbnail?: string; small?: string; medium?: string; large?: string; extraLarge?: string };
    previewLink?: string;
    infoLink?: string;
  };
};

const API = "https://www.googleapis.com/books/v1/volumes";

export async function searchBooks(params: { q: string; startIndex?: number; maxResults?: number; category?: string }): Promise<{ items: Book[]; totalItems: number }> {
  const q = params.category && params.category !== "All" ? `${params.q || "subject:" + params.category} subject:${params.category}` : params.q;
  const url = `${API}?q=${encodeURIComponent(q || "bestsellers")}&startIndex=${params.startIndex ?? 0}&maxResults=${params.maxResults ?? 20}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch books");
  const data = await res.json();
  return { items: data.items ?? [], totalItems: data.totalItems ?? 0 };
}

export async function getBook(id: string): Promise<Book> {
  const res = await fetch(`${API}/${id}`);
  if (!res.ok) throw new Error("Book not found");
  return res.json();
}

export function getCover(book: Book, size: "thumb" | "large" = "thumb"): string {
  const img = book.volumeInfo.imageLinks;
  if (!img) return "";
  const url = size === "large"
    ? img.extraLarge || img.large || img.medium || img.small || img.thumbnail || ""
    : img.thumbnail || img.smallThumbnail || "";
  return url.replace(/^http:/, "https:");
}

export const CATEGORIES = ["All", "Fiction", "Fantasy", "Mystery", "Science", "Biography", "History", "Romance", "Business", "Poetry"];
