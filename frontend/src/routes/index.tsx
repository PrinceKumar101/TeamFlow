import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import {
  CheckCircle2,
  Users,
  BarChart3,
  Clock,
  Zap,
  Lock,
  Menu,
  X,
  Calendar,
  MessageSquare,
  Flag,
  ArrowRight,
  Star,
  Github,
  Twitter,
  Linkedin,
  ChevronRight,
  Sparkles,
  Shield,
  Globe,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { toggleTheme } from "@/store/slices/themeSlice";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

/* ───── Intersection Observer hook for scroll-triggered animations ───── */
function useInView(threshold = 0.15) {
  const [inView, setInView] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;
    
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  const ref = (el: HTMLDivElement | null) => {
    elementRef.current = el;
  };

  return { ref, inView };
}

function RouteComponent() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features = [
    {
      icon: Calendar,
      title: "Smart Planning",
      description:
        "Organize tasks with intuitive calendars, timelines, and kanban boards that adapt to your workflow.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Work seamlessly with real-time cursors, comments, @mentions and shared workspaces.",
      color: "from-violet-500 to-purple-500",
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description:
        "Track velocity, burndown charts, and team-performance metrics at a glance.",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Clock,
      title: "Time Tracking",
      description:
        "Built-in time tracking per task so you always know where your hours go.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Zap,
      title: "Automations",
      description:
        "Automate repetitive workflows and integrate with Slack, GitHub, Figma & 100+ tools.",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description:
        "SOC 2, SSO, RBAC, audit logs and 99.99 % uptime SLA — built for scale.",
      color: "from-primary to-chart-2",
    },
  ];

  const plans = [
    {
      name: "Starter",
      price: "$0",
      period: "forever",
      description: "Great for side-projects & solo makers",
      features: [
        "Up to 3 members",
        "1 GB storage",
        "Basic board view",
        "Community support",
      ],
    },
    {
      name: "Professional",
      price: "$12",
      period: "/member/mo",
      description: "For growing teams that ship fast",
      features: [
        "Unlimited members",
        "100 GB storage",
        "Advanced analytics",
        "Priority support",
        "Custom workflows",
        "API access",
        "Time tracking",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For orgs that need control & compliance",
      features: [
        "Everything in Pro",
        "Unlimited storage",
        "SAML / SSO",
        "24/7 dedicated support",
        "Custom SLA",
        "Audit logs",
        "Dedicated CSM",
      ],
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Engineering Lead, Vercel",
      text: "TeamFlow replaced 3 different tools for us. Our sprint velocity increased 40 % in the first quarter.",
      avatar: "SC",
    },
    {
      name: "James Okoro",
      role: "PM, Stripe",
      text: "The best project management tool I've used. Period. The real-time collaboration is magic.",
      avatar: "JO",
    },
    {
      name: "Maria Silva",
      role: "CTO, Linear",
      text: "We evaluated every tool on the market. TeamFlow won on speed, design and developer experience.",
      avatar: "MS",
    },
    {
      name: "David Park",
      role: "Founder, Raycast",
      text: "Finally a PM tool that engineers actually enjoy using. Keyboard-first, blazingly fast.",
      avatar: "DP",
    },
  ];

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

  /* section refs */
  const featureVis = useInView();
  const statsVis = useInView();
  const pricingVis = useInView();
  const testimonialVis = useInView();
  const ctaVis = useInView();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden noise-overlay relative">
      {/* ══════ Ambient background orbs ══════ */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-150 h-150 rounded-full bg-chart-2/20 blur-[140px] animate-pulse-glow shadow-2xl shadow-chart-2/30" />
        <div
          className="absolute top-[30%] right-[-10%] w-125 h-125 rounded-full bg-accent/15 blur-[120px] animate-pulse-glow shadow-2xl shadow-accent/25"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-[-10%] left-[30%] w-125 h-125 rounded-full bg-chart-3/15 blur-[130px] animate-pulse-glow shadow-2xl shadow-chart-3/25"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* ══════ Navigation ══════ */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-lg shadow-black/20" : "bg-transparent"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div
              className="flex items-center gap-2.5 group cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
                <Flag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">TeamFlow</span>
            </div>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {["Features", "Pricing", "Testimonials"].map((item) => (
                <button
                  key={item}
                  onClick={() =>
                    document
                      .getElementById(item.toLowerCase())
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="px-4 py-2 text-sm text-secondary-foreground hover:text-foreground rounded-lg hover:bg-card transition-all hover:shadow-lg hover:shadow-primary/10"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Auth buttons desktop */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground hover:bg-card hover:shadow-lg hover:shadow-primary/10 transition-all"
                onClick={() => navigate({ to: "/login" })}
              >
                Sign In
              </Button>
              <Button
                className="bg-linear-to-r from-primary to-chart-2 hover:from-chart-2 hover:to-chart-3 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/50 transition-all hover:shadow-2xl"
                onClick={() => navigate({ to: "/signup" })}
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                onClick={() => {
                  dispatch(toggleTheme());
                }}
              >
                tog
              </Button>
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-card"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-6 pt-2 space-y-2 animate-slide-up">
              {["Features", "Pricing", "Testimonials"].map((item) => (
                <button
                  key={item}
                  className="block w-full text-left px-4 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition hover:shadow-lg hover:shadow-primary/10"
                  onClick={() => {
                    document
                      .getElementById(item.toLowerCase())
                      ?.scrollIntoView({ behavior: "smooth" });
                    setIsMenuOpen(false);
                  }}
                >
                  {item}
                </button>
              ))}
              <div className="pt-3 flex flex-col gap-2">
                <Button
                  variant="ghost"
                  className="justify-start text-secondary-foreground hover:text-foreground hover:bg-card transition"
                  onClick={() => navigate({ to: "/login" })}
                >
                  Sign In
                </Button>
                <Button
                  className="bg-linear-to-r from-primary to-chart-2 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40"
                  onClick={() => navigate({ to: "/signup" })}
                >
                  Get Started Free <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ══════ Hero ══════ */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 md:pt-44 md:pb-32">
        <div className="text-center space-y-8">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 animate-slide-up shadow-lg shadow-primary/15 hover:shadow-xl hover:shadow-primary/25 transition-all cursor-pointer hover:border-primary/60 hover:bg-primary/15">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Now with AI-powered project insights
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-primary" />
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] animate-slide-up-delay-1">
            Manage Projects.
            <br />
            <span className="text-gradient animate-gradient-shift">
              Empower Teams.
            </span>
          </h1>

          {/* Sub-heading */}
          <p className="text-lg md:text-xl text-secondary-foreground max-w-2xl mx-auto leading-relaxed animate-slide-up-delay-2">
            The all-in-one workspace where modern teams plan, track and ship
            products together — beautifully fast.
          </p>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2 animate-slide-up-delay-3">
            <Button
              className="bg-linear-to-r from-primary to-chart-2 hover:from-chart-2 hover:to-chart-3 text-primary-foreground shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50 transition-all hover:scale-105"
              onClick={() => navigate({ to: "/signup" })}
            >
              Start Free — No Card Needed
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              className="border-border text-muted-foreground hover:text-foreground hover:bg-card hover:shadow-lg hover:shadow-primary/15 px-8 py-6 text-lg transition-all hover:border-primary/50"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Demo
            </Button>
          </div>

          {/* Social proof */}
          <div className="flex flex-col items-center gap-3 pt-4 animate-slide-up-delay-4">
            <div className="flex -space-x-2">
              {[
                "bg-violet-500",
                "bg-cyan-500",
                "bg-amber-500",
                "bg-rose-500",
                "bg-emerald-500",
              ].map((bg, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full ${bg} border-2 border-background flex items-center justify-center text-xs font-semibold`}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-amber-400 text-amber-400"
                />
              ))}
              <span className="text-sm text-muted-foreground ml-2">
                Loved by <span className="text-foreground font-medium">10,000+</span>{" "}
                teams
              </span>
            </div>
          </div>
        </div>

        {/* Hero mockup / dashboard preview */}
        <div
          className="mt-20 relative max-w-5xl mx-auto animate-fade-in"
          style={{ animationDelay: "0.6s", animationFillMode: "both" }}
        >
          <div className="absolute -inset-1 bg-linear-to-r from-primary/20 via-accent/20 to-chart-3/20 rounded-2xl blur-2xl shadow-2xl shadow-primary/25" />
          <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-2xl hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300">
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-muted border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 mx-4">
                <div className="h-6 bg-muted rounded-md max-w-sm mx-auto flex items-center justify-center text-xs text-muted-foreground">
                  app.teamflow.dev/dashboard
                </div>
              </div>
            </div>
            {/* Content area: a stylized dashboard preview */}
            <div className="p-6 md:p-8 grid grid-cols-12 gap-4">
              {/* Sidebar mock */}
              <div className="col-span-3 hidden md:flex flex-col gap-3">
                <div className="h-8 bg-muted rounded-lg w-3/4" />
                <div className="h-6 bg-primary/20 rounded-lg" />
                <div className="h-6 bg-muted rounded-lg" />
                <div className="h-6 bg-muted rounded-lg w-5/6" />
                <div className="h-6 bg-muted rounded-lg w-4/6" />
                <div className="mt-auto h-6 bg-muted rounded-lg w-2/3" />
              </div>
              {/* Main content mock */}
              <div className="col-span-12 md:col-span-9 space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 h-24 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/10 p-4">
                    <div className="h-3 bg-primary/30 rounded w-16 mb-2" />
                    <div className="h-6 bg-primary/20 rounded w-12" />
                  </div>
                  <div className="flex-1 h-24 rounded-xl bg-linear-to-br from-accent/20 to-accent/5 border border-accent/10 p-4">
                    <div className="h-3 bg-accent/30 rounded w-16 mb-2" />
                    <div className="h-6 bg-accent/20 rounded w-12" />
                  </div>
                  <div className="flex-1 h-24 rounded-xl bg-linear-to-br from-chart-3/20 to-chart-3/5 border border-chart-3/10 p-4 hidden sm:block">
                    <div className="h-3 bg-chart-3/30 rounded w-16 mb-2" />
                    <div className="h-6 bg-chart-3/20 rounded w-12" />
                  </div>
                </div>
                {/* Kanban columns */}
                <div className="grid grid-cols-3 gap-3">
                  {["To Do", "In Progress", "Done"].map((col) => (
                    <div
                      key={col}
                      className="rounded-xl bg-card border border-border p-3 space-y-2"
                    >
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                        {col}
                      </div>
                      {[...Array(col === "In Progress" ? 3 : 2)].map((_, j) => (
                        <div
                          key={j}
                          className="h-10 rounded-lg bg-muted border border-border"
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ Logo cloud ══════ */}
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

      {/* ══════ Features ══════ */}
      {/* eslint-disable @typescript-eslint/no-explicit-any */}
      <section
        id="features"
        ref={featureVis.ref as any}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28"
      >
        <div
          // eslint-disable-next-line
          className={`text-center mb-16 transition-all duration-700 ${featureVis.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
            Features
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything your team needs
          </h2>
          <p className="text-lg text-secondary-foreground max-w-xl mx-auto">
            Powerful alone — unstoppable together. One platform to plan, track &
            deliver.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className={`glass-card rounded-2xl p-7 group transition-all duration-500 cursor-default hover:shadow-xl hover:shadow-primary/15 hover:-translate-y-2 ${featureVis.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${idx * 80}ms` }}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-linear-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-secondary-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════ Stats ══════ */}
      {/* eslint-disable @typescript-eslint/no-explicit-any */}
      <section ref={statsVis.ref as any} className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            // eslint-disable-next-line
            className={`grid sm:grid-cols-3 gap-8 transition-all duration-700 ${statsVis.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {[
              { value: "10,000+", label: "Teams worldwide", icon: Globe },
              { value: "2M+", label: "Tasks completed", icon: CheckCircle2 },
              { value: "99.99%", label: "Uptime SLA", icon: Shield },
            ].map((stat, i) => (
              <div key={i} className="gradient-border rounded-2xl">
                <div className="rounded-2xl bg-card p-8 text-center">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                  <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                    {stat.value}
                  </div>
                  <p className="text-secondary-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ Testimonials ══════ */}
      {/* eslint-disable @typescript-eslint/no-explicit-any */}
      <section
        id="testimonials"
        ref={testimonialVis.ref as any}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 border-t border-border"
      >
        <div
          // eslint-disable-next-line
          className={`text-center mb-16 transition-all duration-700 ${testimonialVis.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
            Testimonials
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Loved by teams everywhere
          </h2>
          <p className="text-lg text-secondary-foreground max-w-xl mx-auto">
            Don't take our word for it — hear from the people who use TeamFlow
            every day.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`glass-card rounded-2xl p-7 transition-all duration-500 hover:shadow-xl hover:shadow-primary/15 hover:-translate-y-2 ${testimonialVis.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-secondary-foreground mb-6 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-chart-2 flex items-center justify-center text-sm font-bold shadow-lg shadow-primary/30">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ Pricing ══════ */}
      {/* eslint-disable @typescript-eslint/no-explicit-any */}
      <section
        id="pricing"
        ref={pricingVis.ref as any}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 border-t border-border"
      >
        <div
          // eslint-disable-next-line
          className={`text-center mb-16 transition-all duration-700 ${pricingVis.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
            Pricing
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-secondary-foreground max-w-xl mx-auto">
            Start free. Upgrade when you're ready. No surprises.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl transition-all duration-500 ${pricingVis.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${
                plan.highlighted
                  ? "gradient-border bg-card scale-[1.03] z-10"
                  : "glass-card"
              }`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-linear-to-r from-primary to-chart-2 text-primary-foreground text-xs font-semibold rounded-full shadow-lg shadow-primary/25">
                  Most Popular
                </div>
              )}
              <div
                className={`p-8 ${plan.highlighted ? "rounded-2xl bg-card" : ""}`}
              >
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-foreground mb-6">
                  {plan.description}
                </p>
                <div className="mb-8">
                  <span className="text-5xl font-extrabold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-secondary-foreground ml-1 text-sm">
                      {plan.period}
                    </span>
                  )}
                </div>
                <Button
                  className={`w-full py-5 font-semibold transition-all ${
                    plan.highlighted
                      ? "bg-linear-to-r from-primary to-chart-2 hover:from-chart-2 hover:to-chart-3 text-primary-foreground shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50 hover:scale-105"
                      : "bg-secondary hover:bg-accent text-foreground border border-border hover:shadow-lg hover:shadow-primary/15 transition-all hover:border-primary/50 hover:scale-105"
                  }`}
                  onClick={() => navigate({ to: "/signup" })}
                >
                  {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <div className="mt-8 space-y-3">
                  {plan.features.map((feature, fidx) => (
                    <div key={fidx} className="flex gap-3 items-start">
                      <CheckCircle2 className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground/60">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      {/* eslint-disable @typescript-eslint/no-explicit-any */}
      <section
        ref={ctaVis.ref as any}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28"
      >
        <div
          // eslint-disable-next-line
          className={`relative rounded-3xl overflow-hidden transition-all duration-700 ${ctaVis.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {/* Background layers */}
          <div className="absolute inset-0 bg-linear-to-br from-chart-3 via-primary to-chart-2" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
          <div className="absolute top-0 right-0 w-56 h-56 bg-accent/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />

          <div className="relative z-10 px-8 py-16 md:px-16 md:py-24 text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Ready to transform
              <br />
              your workflow?
            </h2>
            <p className="text-lg text-secondary-foreground mb-10 max-w-xl mx-auto">
              Join 10,000+ teams shipping better software with TeamFlow. Free
              14-day trial — no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-primary-foreground text-primary hover:bg-secondary px-8 py-6 text-lg font-semibold shadow-xl shadow-black/10 hover:shadow-black/20 transition-all"
                onClick={() => navigate({ to: "/signup" })}
              >
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="border-border text-foreground hover:bg-card hover:shadow-lg hover:shadow-primary/10 px-8 py-6 text-lg transition-all"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Talk to Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ Footer ══════ */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center">
                  <Flag className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold">TeamFlow</span>
              </div>
              <p className="text-slate-500 text-sm max-w-xs leading-relaxed mb-6">
                The modern project management platform built for teams that ship
                fast.
              </p>
              <div className="flex gap-3">
                {[Github, Twitter, Linkedin].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-lg bg-card hover:bg-muted flex items-center justify-center text-secondary-foreground hover:text-foreground transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
            {/* Links */}
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Integrations", "Changelog"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Press"],
              },
              {
                title: "Legal",
                links: ["Privacy", "Terms", "Security", "Contact"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-slate-500 hover:text-white transition"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              &copy; 2026 TeamFlow. All rights reserved.
            </p>
            <p className="text-muted-foreground/70 text-xs">
              Built with care for modern teams.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
