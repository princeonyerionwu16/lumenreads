import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { FloatingInput, SocialButton, SubmitButton } from "@/components/AuthFields";
import { AuthShell } from "./login";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — LumenReads" },
      { name: "description", content: "Create your free LumenReads account." },
    ],
  }),
  component: Register,
});

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = "Tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email.";
    if (password.length < 6) next.password = "Use at least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    setTimeout(() => {
      const u = register(name.trim(), email);
      toast(`Welcome, ${u.name}!`, { description: "Your reading life starts now." });
      navigate({ to: "/dashboard" });
    }, 700);
  };

  return (
    <AuthShell title="Create your account" subtitle="Start tracking, saving, and discovering books today.">
      <form onSubmit={onSubmit} className="space-y-4">
        <FloatingInput label="Full name" autoComplete="name" value={name} onChange={setName} error={errors.name} />
        <FloatingInput label="Email" type="email" autoComplete="email" value={email} onChange={setEmail} error={errors.email} />
        <FloatingInput label="Password" type="password" autoComplete="new-password" value={password} onChange={setPassword} error={errors.password} />
        <p className="text-xs text-muted-foreground">By signing up you agree to our terms and privacy policy.</p>
        <SubmitButton loading={loading}>Create account <ArrowRight className="size-4" /></SubmitButton>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="flex-1 h-px bg-border" />
        <span className="uppercase tracking-wider">or sign up with</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="flex gap-3">
        <SocialButton icon={<span className="size-4 rounded-full bg-gradient-to-br from-rose-500 to-amber-400" />} label="Google" />
        <SocialButton icon={<span className="size-4 rounded-full bg-foreground" />} label="GitHub" />
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}
