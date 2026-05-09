const KEY = "bookfinder.search.history";
const MAX = 8;

export function getHistory(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function pushHistory(q: string) {
  const v = q.trim();
  if (!v) return;
  const cur = getHistory().filter((s) => s.toLowerCase() !== v.toLowerCase());
  const next = [v, ...cur].slice(0, MAX);
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("search-history-updated"));
}

export function clearHistory() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("search-history-updated"));
}

export const TRENDING = [
  "Atomic Habits",
  "Sapiens",
  "Dune",
  "The Midnight Library",
  "Project Hail Mary",
  "Tomorrow, and Tomorrow",
  "Fourth Wing",
  "Lessons in Chemistry",
];
