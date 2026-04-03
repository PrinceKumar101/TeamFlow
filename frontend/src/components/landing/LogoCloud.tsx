export default function LogoCloud() {
  const logos = [
    "Vercel",
    "Stripe",
    "Linear",
    "Raycast",
    "Supabase",
    "Planetscale",
    "Clerk",
    "Resend",
  ];

  return (
    <section className="border-y border-border py-10 overflow-hidden">
      <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-8">
        Trusted by forward-thinking teams
      </p>
      <div className="relative">
        <div className="flex gap-16 animate-marquee whitespace-nowrap">
          {[...logos, ...logos].map((name, i) => (
            <span
              key={i}
              className="text-slate-500/60 text-lg font-semibold tracking-wide select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
