import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { BookOpen, Compass, Heart, Info, LayoutDashboard, Library, LogOut, Menu, Moon, Sparkles, Sun, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getInitials, useAuth } from "@/lib/auth";
import { toast } from "sonner";

type NavLink = { to: "/" | "/explore" | "/about" | "/favorites" | "/dashboard" | "/library"; label: string; icon?: typeof Heart };

export function Navbar() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "dark" | "light" | null;
    const initial = saved ?? "dark";
    setTheme(initial);
    document.documentElement.classList.toggle("light", initial === "light");
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  useEffect(() => { setOpen(false); setMenu(false); }, [location.pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("light", next === "light");
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const isActive = (p: string) => location.pathname === p;

  const guestLinks: NavLink[] = [
    { to: "/", label: "Home" },
    { to: "/explore", label: "Explore", icon: Compass },
    { to: "/about", label: "About", icon: Info },
  ];
  const userLinks: NavLink[] = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/explore", label: "Explore", icon: Compass },
    { to: "/library", label: "Library", icon: Library },
    { to: "/favorites", label: "Favorites", icon: Heart },
  ];
  const links = isAuthenticated ? userLinks : guestLinks;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 glass"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="size-9 rounded-xl bg-[var(--gradient-primary)] grid place-items-center shadow-glow group-hover:scale-110 group-hover:rotate-3 transition-transform">
            <BookOpen className="size-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">Lumen<span className="gradient-text">Reads</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to + l.label}
              to={l.to}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive(l.to) ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.icon && <l.icon className="size-4" />} {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="size-9 rounded-lg grid place-items-center hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </motion.span>
            </AnimatePresence>
          </button>

          {isAuthenticated && user ? (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenu((m) => !m)}
                className="size-10 rounded-full bg-[var(--gradient-primary)] grid place-items-center text-sm font-display font-semibold text-primary-foreground hover:scale-105 transition-transform shadow-glow"
                aria-label="Account menu"
              >
                {getInitials(user.name)}
              </button>
              <AnimatePresence>
                {menu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2 w-64 glass rounded-2xl shadow-elegant overflow-hidden"
                  >
                    <div className="p-4 border-b border-border">
                      <p className="font-semibold truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div className="p-1.5">
                      <MenuItem to="/dashboard" icon={LayoutDashboard}>Dashboard</MenuItem>
                      <MenuItem to="/library" icon={Library}>My Library</MenuItem>
                      <MenuItem to="/favorites" icon={Heart}>Favorites</MenuItem>
                      <button
                        onClick={() => { logout(); toast("Signed out"); navigate({ to: "/" }); }}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center gap-2 hover:bg-secondary/60 text-destructive transition-colors"
                      >
                        <LogOut className="size-4" /> Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 rounded-xl bg-[var(--gradient-primary)] text-primary-foreground text-sm font-medium hover:scale-105 transition-transform shadow-glow inline-flex items-center gap-1.5">
                <Sparkles className="size-3.5" /> Sign Up
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-1">
          <button onClick={toggle} aria-label="Toggle theme" className="size-9 rounded-lg grid place-items-center text-muted-foreground hover:text-foreground">
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          {isAuthenticated && user && (
            <Link to="/dashboard" className="size-9 rounded-full bg-[var(--gradient-primary)] grid place-items-center text-xs font-display font-semibold text-primary-foreground">
              {getInitials(user.name)}
            </Link>
          )}
          <button onClick={() => setOpen((o) => !o)} aria-label="Menu" className="size-9 rounded-lg grid place-items-center text-muted-foreground hover:text-foreground">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.to + l.label}
                  to={l.to}
                  className={`px-3 py-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
                    isActive(l.to) ? "text-foreground bg-secondary" : "text-muted-foreground"
                  }`}
                >
                  {l.icon && <l.icon className="size-4" />} {l.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Link to="/login" className="px-3 py-2.5 rounded-xl glass text-sm font-medium text-center">Login</Link>
                  <Link to="/register" className="px-3 py-2.5 rounded-xl bg-[var(--gradient-primary)] text-primary-foreground text-sm font-medium text-center">Sign Up</Link>
                </div>
              )}
              {isAuthenticated && (
                <button
                  onClick={() => { logout(); toast("Signed out"); navigate({ to: "/" }); }}
                  className="mt-2 px-3 py-3 rounded-lg text-sm font-medium flex items-center gap-2 text-destructive"
                >
                  <LogOut className="size-4" /> Sign out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function MenuItem({ to, icon: Icon, children }: { to: "/dashboard" | "/library" | "/favorites"; icon: typeof User; children: React.ReactNode }) {
  return (
    <Link to={to} className="px-3 py-2.5 rounded-xl text-sm flex items-center gap-2 hover:bg-secondary/60 transition-colors">
      <Icon className="size-4" /> {children}
    </Link>
  );
}
