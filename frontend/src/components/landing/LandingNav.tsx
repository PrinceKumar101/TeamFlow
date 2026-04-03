import { Link } from "@tanstack/react-router";
import { Menu, X, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ThemSwitcherButton from "@/components/themeSwitcher";

type LandingNavProps = {
  onSignIn: () => void;
  onSignUp: () => void;
};

export default function LandingNav({ onSignIn, onSignUp }: LandingNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center gap-2.5 group cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Link to="/">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
                <img src="/logo.png" className="size-6" alt="TeamFlow logo" />
              </div>
            </Link>
            <span className="text-xl font-bold tracking-tight">TeamFlow</span>
          </div>

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

          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground hover:bg-card hover:shadow-lg hover:shadow-primary/10 transition-all"
              onClick={onSignIn}
            >
              Sign In
            </Button>
            <Button
              className="bg-linear-to-r from-primary to-chart-2 hover:from-chart-2 hover:to-chart-3 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/50 transition-all hover:shadow-2xl"
              onClick={onSignUp}
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <ThemSwitcherButton />
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-card"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

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
                onClick={onSignIn}
              >
                Sign In
              </Button>
              <Button
                className="bg-linear-to-r from-primary to-chart-2 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40"
                onClick={onSignUp}
              >
                Get Started Free <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
