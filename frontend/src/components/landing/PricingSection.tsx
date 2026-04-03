import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInView } from "./useInView";

type PricingSectionProps = {
  onSignUp: () => void;
};

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "Great for side-projects and solo makers",
    features: ["Up to 3 members", "1 GB storage", "Basic board view", "Community support"],
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
    description: "For orgs that need control and compliance",
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

export default function PricingSection({ onSignUp }: PricingSectionProps) {
  const pricingVis = useInView<HTMLElement>();

  return (
    <section
      id="pricing"
      ref={pricingVis.ref}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 border-t border-border"
    >
      <div
        className={`text-center mb-16 transition-all duration-700 ${
          pricingVis.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Pricing</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h2>
        <p className="text-lg text-secondary-foreground max-w-xl mx-auto">
          Start free. Upgrade when you are ready. No surprises.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`relative rounded-2xl transition-all duration-500 ${
              pricingVis.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            } ${plan.highlighted ? "gradient-border bg-card scale-[1.03] z-10" : "glass-card"}`}
            style={{ transitionDelay: `${idx * 100}ms` }}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-linear-to-r from-primary to-chart-2 text-primary-foreground text-xs font-semibold rounded-full shadow-lg shadow-primary/25">
                Most Popular
              </div>
            )}
            <div className={`p-8 ${plan.highlighted ? "rounded-2xl bg-card" : ""}`}>
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <p className="text-sm text-foreground mb-6">{plan.description}</p>
              <div className="mb-8">
                <span className="text-5xl font-extrabold">{plan.price}</span>
                {plan.period && <span className="text-secondary-foreground ml-1 text-sm">{plan.period}</span>}
              </div>

              <Button
                className={`w-full py-5 font-semibold transition-all ${
                  plan.highlighted
                    ? "bg-linear-to-r from-primary to-chart-2 hover:from-chart-2 hover:to-chart-3 text-primary-foreground shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50 hover:scale-105"
                    : "bg-secondary hover:bg-accent text-foreground border border-border hover:shadow-lg hover:shadow-primary/15 hover:border-primary/50 hover:scale-105"
                }`}
                onClick={onSignUp}
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
  );
}
