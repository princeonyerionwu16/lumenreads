import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { BookOpen, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { FloatingInput, SocialButton, SubmitButton } from "@/components/AuthFields";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — LumenReads" },
      { name: "description", content: "Sign in to your LumenReads account." },
    ],
  }),
  component: Login,
});

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email.";
    if (password.length < 6) next.password = "At least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    setTimeout(() => {
      const u = login(email);
      if (!remember) {
        // No-op: localStorage is the only sim. We mark a session-only flag for UX completeness.
        sessionStorage.setItem("lumenreads.session", "1");
      }
      toast(`Welcome back, ${u.name}`, { description: "Signed in successfully." });
      navigate({ to: "/dashboard" });
    }, 600);
  };

  return <AuthShell title="Welcome back" subtitle="Sign in to continue your reading journey.">
    <form onSubmit={onSubmit} className="space-y-4">
      <FloatingInput label="Email" type="email" autoComplete="email" value={email} onChange={setEmail} error={errors.email} />
      <FloatingInput label="Password" type="password" autoComplete="current-password" value={password} onChange={setPassword} error={errors.password} />
      <div className="flex items-center justify-between text-sm">
        <label className="inline-flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
            className="size-4 rounded border-border bg-transparent accent-[var(--color-primary)]" />
          Remember me
        </label>
        <button type="button" className="text-primary hover:underline">Forgot password?</button>
      </div>
      <SubmitButton loading={loading}>Sign in <ArrowRight className="size-4" /></SubmitButton>
    </form>

    <Divider>or continue with</Divider>

    <div className="flex gap-3">
      <SocialButton icon={<GoogleIcon />} label="Google" />
      <SocialButton icon={<GithubIcon />} label="GitHub" />
    </div>

    <p className="mt-8 text-center text-sm text-muted-foreground">
      Don't have an account?{" "}
      <Link to="/register" className="text-primary font-medium hover:underline">Create one</Link>
    </p>
  </AuthShell>;
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-80" />
          <div className="absolute top-20 left-10 size-72 rounded-full bg-primary/30 blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 size-72 rounded-full bg-accent/30 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>
        <Link to="/" className="flex items-center gap-2">
          <div className="size-10 rounded-xl bg-[var(--gradient-primary)] grid place-items-center shadow-glow">
            <BookOpen className="size-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl">Lumen<span className="gradient-text">Reads</span></span>
        </Link>
        <div>
          <h2 className="font-display text-4xl font-bold leading-tight max-w-md">
            "Books are a uniquely portable magic."
          </h2>
          <p className="mt-3 text-muted-foreground">— Stephen King</p>
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} LumenReads</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="size-9 rounded-xl bg-[var(--gradient-primary)] grid place-items-center">
              <BookOpen className="size-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">Lumen<span className="gradient-text">Reads</span></span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}

function Divider({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
      <div className="flex-1 h-px bg-border" />
      <span className="uppercase tracking-wider">{children}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1S8.7 6 12 6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.5 14.6 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12S6.8 21.5 12 21.5c6.9 0 9.5-4.8 9.5-7.3 0-.5 0-.9-.1-1.3H12z"/>
    </svg>
  );
}
function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current">
      <path d="M12 .5a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1.1 1.9 2.9 1.4 3.6 1 .1-.8.4-1.4.8-1.7-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.3.8 1 .8 2.1v3.1c0 .3.2.7.8.6A12 12 0 0012 .5z"/>
    </svg>
  );
}
