import { lazy, Suspense } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";

const LogoCloud = lazy(() => import("@/components/landing/LogoCloud"));
const FeaturesSection = lazy(() => import("@/components/landing/FeaturesSection"));
const StatsSection = lazy(() => import("@/components/landing/StatsSection"));
const TestimonialsSection = lazy(
  () => import("@/components/landing/TestimonialsSection"),
);
const PricingSection = lazy(() => import("@/components/landing/PricingSection"));
const CtaSection = lazy(() => import("@/components/landing/CtaSection"));
const LandingFooter = lazy(() => import("@/components/landing/LandingFooter"));

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const goToSignIn = () => navigate({ to: "/login" });
  const goToSignUp = () => navigate({ to: "/signup" });

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden noise-overlay relative">
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

      <LandingNav onSignIn={goToSignIn} onSignUp={goToSignUp} />
      <HeroSection onSignUp={goToSignUp} />
      <Suspense fallback={null}>
        <LogoCloud />
        <FeaturesSection />
        <StatsSection />
        <TestimonialsSection />
        <PricingSection onSignUp={goToSignUp} />
        <CtaSection onSignUp={goToSignUp} />
        <LandingFooter />
      </Suspense>
    </div>
  );
}
