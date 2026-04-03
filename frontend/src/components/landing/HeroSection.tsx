import { ArrowRight, ChevronRight, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

type HeroSectionProps = {
  onSignUp: () => void;
};

export default function HeroSection({ onSignUp }: HeroSectionProps) {
  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 md:pt-44 md:pb-32">
      <div className="text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 animate-slide-up shadow-lg shadow-primary/15 hover:shadow-xl hover:shadow-primary/25 transition-all cursor-pointer hover:border-primary/60 hover:bg-primary/15">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            Now with AI-powered project insights
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-primary" />
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] animate-slide-up-delay-1">
          Manage Projects.
          <br />
          <span className="text-gradient animate-gradient-shift">Empower Teams.</span>
        </h1>

        <p className="text-lg md:text-xl text-secondary-foreground max-w-2xl mx-auto leading-relaxed animate-slide-up-delay-2">
          The all-in-one workspace where modern teams plan, track and ship
          products together - beautifully fast.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2 animate-slide-up-delay-3">
          <Button
            className="bg-linear-to-r from-primary to-chart-2 hover:from-chart-2 hover:to-chart-3 text-primary-foreground shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50 transition-all hover:scale-105"
            onClick={onSignUp}
          >
            Start Free - No Card Needed
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            variant="outline"
            className="border-border text-muted-foreground hover:text-foreground hover:bg-card hover:shadow-lg hover:shadow-primary/15 px-8 py-6 text-lg transition-all hover:border-primary/50"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch Demo
          </Button>
        </div>

        <div className="flex flex-col items-center gap-3 pt-4 animate-slide-up-delay-4">
          <div className="flex -space-x-2">
            {["bg-violet-500", "bg-cyan-500", "bg-amber-500", "bg-rose-500", "bg-emerald-500"].map((bg, i) => (
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
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-sm text-muted-foreground ml-2">
              Loved by <span className="text-foreground font-medium">10,000+</span> teams
            </span>
          </div>
        </div>
      </div>

      <div
        className="mt-20 relative max-w-5xl mx-auto animate-fade-in"
        style={{ animationDelay: "0.6s", animationFillMode: "both" }}
      >
        <div className="absolute -inset-1 bg-linear-to-r from-primary/20 via-accent/20 to-chart-3/20 rounded-2xl blur-2xl shadow-2xl shadow-primary/25" />
        <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-2xl hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300">
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

          <div className="p-6 md:p-8 grid grid-cols-12 gap-4">
            <div className="col-span-3 hidden md:flex flex-col gap-3">
              <div className="h-8 bg-muted rounded-lg w-3/4" />
              <div className="h-6 bg-primary/20 rounded-lg" />
              <div className="h-6 bg-muted rounded-lg" />
              <div className="h-6 bg-muted rounded-lg w-5/6" />
              <div className="h-6 bg-muted rounded-lg w-4/6" />
              <div className="mt-auto h-6 bg-muted rounded-lg w-2/3" />
            </div>

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

              <div className="grid grid-cols-3 gap-3">
                {["To Do", "In Progress", "Done"].map((col) => (
                  <div key={col} className="rounded-xl bg-card border border-border p-3 space-y-2">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                      {col}
                    </div>
                    {[...Array(col === "In Progress" ? 3 : 2)].map((_, j) => (
                      <div key={j} className="h-10 rounded-lg bg-muted border border-border" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
