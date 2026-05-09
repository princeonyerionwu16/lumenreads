import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function FloatingInput({
  label, type = "text", value, onChange, autoComplete, error,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (show ? "text" : "password") : type;
  const filled = value.length > 0;
  return (
    <div>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          className={`peer w-full px-4 pt-6 pb-2 pr-12 rounded-xl glass outline-none focus:ring-2 transition-all ${
            error ? "ring-2 ring-destructive/60" : "focus:ring-primary/60"
          }`}
          placeholder=" "
        />
        <label
          className={`pointer-events-none absolute left-4 transition-all text-muted-foreground ${
            filled ? "top-1.5 text-[10px] uppercase tracking-wider" : "top-4 text-sm"
          } peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-primary`}
        >
          {label}
        </label>
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 size-9 grid place-items-center rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-xs text-destructive">{error}</motion.p>
      )}
    </div>
  );
}

export function SubmitButton({ loading, children }: { loading?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="group relative w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[var(--gradient-primary)] text-primary-foreground font-medium shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-70"
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}

export function SocialButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={() => {}}
      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass text-sm font-medium hover:scale-[1.02] active:scale-95 transition-transform"
    >
      {icon} {label}
    </button>
  );
}
