import { ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInView } from "./useInView";

type CtaSectionProps = {
  onSignUp: () => void;
};

export default function CtaSection({ onSignUp }: CtaSectionProps) {
  const ctaVis = useInView<HTMLElement>();

  return (
    <section ref={ctaVis.ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
      <div
        className={`relative rounded-3xl overflow-hidden transition-all duration-700 ${
          ctaVis.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
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
            Join 10,000+ teams shipping better software with TeamFlow. Free 14-day trial - no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-primary-foreground text-primary hover:bg-secondary px-8 py-6 text-lg font-semibold shadow-xl shadow-black/10 hover:shadow-black/20 transition-all"
              onClick={onSignUp}
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
  );
}
