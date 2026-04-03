import { Star } from "lucide-react";
import { useInView } from "./useInView";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Engineering Lead, Vercel",
    text: "TeamFlow replaced 3 different tools for us. Our sprint velocity increased 40% in the first quarter.",
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

export default function TestimonialsSection() {
  const testimonialVis = useInView<HTMLElement>();

  return (
    <section
      id="testimonials"
      ref={testimonialVis.ref}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 border-t border-border"
    >
      <div
        className={`text-center mb-16 transition-all duration-700 ${
          testimonialVis.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Testimonials</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by teams everywhere</h2>
        <p className="text-lg text-secondary-foreground max-w-xl mx-auto">
          Do not take our word for it - hear from the people who use TeamFlow every day.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className={`glass-card rounded-2xl p-7 transition-all duration-500 hover:shadow-xl hover:shadow-primary/15 hover:-translate-y-2 ${
              testimonialVis.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
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
  );
}
