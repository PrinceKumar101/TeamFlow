import { CheckCircle2, Globe, Shield } from "lucide-react";
import { useInView } from "./useInView";

export default function StatsSection() {
  const statsVis = useInView<HTMLElement>();

  const stats = [
    { value: "10,000+", label: "Teams worldwide", icon: Globe },
    { value: "2M+", label: "Tasks completed", icon: CheckCircle2 },
    { value: "99.99%", label: "Uptime SLA", icon: Shield },
  ];

  return (
    <section ref={statsVis.ref} className="py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid sm:grid-cols-3 gap-8 transition-all duration-700 ${
            statsVis.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {stats.map((stat, i) => (
            <div key={i} className="gradient-border rounded-2xl">
              <div className="rounded-2xl bg-card p-8 text-center">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">{stat.value}</div>
                <p className="text-secondary-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
