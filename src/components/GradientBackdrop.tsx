export function GradientBackdrop() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 gradient-mesh-bg opacity-60" />
      <div className="absolute top-[-10%] left-[-5%] size-[500px] rounded-full bg-primary/20 blur-[120px] animate-float" />
      <div className="absolute bottom-[-10%] right-[-5%] size-[500px] rounded-full bg-accent/20 blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
    </div>
  );
}
