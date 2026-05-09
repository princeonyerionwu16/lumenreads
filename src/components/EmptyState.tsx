import { motion } from "framer-motion";
import { SearchX } from "lucide-react";

export function EmptyState({ title = "No books found", description = "Try a different search term or category." }: { title?: string; description?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-24"
    >
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-[var(--gradient-primary)] blur-3xl opacity-30 rounded-full" />
        <div className="relative size-24 mx-auto rounded-3xl glass grid place-items-center mb-6">
          <SearchX className="size-10 text-muted-foreground" />
        </div>
      </div>
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-sm mx-auto">{description}</p>
    </motion.div>
  );
}
