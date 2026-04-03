import { Flag, Github, Linkedin, Twitter } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center">
                <Flag className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold">TeamFlow</span>
            </div>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed mb-6">
              The modern project management platform built for teams that ship fast.
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
                    <a href="#" className="text-sm text-slate-500 hover:text-white transition">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">&copy; 2026 TeamFlow. All rights reserved.</p>
          <p className="text-muted-foreground/70 text-xs">Built with care for modern teams.</p>
        </div>
      </div>
    </footer>
  );
}
