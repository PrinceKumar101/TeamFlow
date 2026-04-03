import { BarChart3, Calendar, Clock, Lock, Users, Zap } from "lucide-react";
import { useInView } from "./useInView";

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
    title: "Analytics and Insights",
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
      "Automate repetitive workflows and integrate with Slack, GitHub, Figma and 100+ tools.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description:
      "SOC 2, SSO, RBAC, audit logs and 99.99% uptime SLA - built for scale.",
    color: "from-primary to-chart-2",
  },
];

export default function FeaturesSection() {
  const featureVis = useInView<HTMLElement>();

  return (
    <section
      id="features"
      ref={featureVis.ref}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28"
    >
      <div
        className={`text-center mb-16 transition-all duration-700 ${
          featureVis.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
          Features
        </p>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything your team needs</h2>
        <p className="text-lg text-secondary-foreground max-w-xl mx-auto">
          Powerful alone - unstoppable together. One platform to plan, track and deliver.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={idx}
              className={`glass-card rounded-2xl p-7 group transition-all duration-500 cursor-default hover:shadow-xl hover:shadow-primary/15 hover:-translate-y-2 ${
                featureVis.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${idx * 80}ms` }}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-linear-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-secondary-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
