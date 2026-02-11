import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Mail,
  Lock,
  AlertCircle,
  Flag,
  ArrowRight,
  Github,
  Eye,
  EyeOff,
  Star,
} from "lucide-react";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Route = createFileRoute("/(auth)/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex noise-overlay relative">
      {/* Ambient orbs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-15%] left-[-5%] w-125 h-125 rounded-full bg-primary/20 blur-[140px] animate-pulse-glow" />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-100 h-100 rounded-full bg-chart-2/15 blur-[120px] animate-pulse-glow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Left decorative panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
        {/* Gradient mesh */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-chart-2/10" />
        <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full bg-chart-2/10 blur-[80px]" />

        <div className="relative z-10 max-w-md space-y-8">
          {/* Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => navigate({ to: "/" })}
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-ring flex items-center justify-center shadow-lg shadow-primary/25">
              <Flag className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground tracking-tight">
              TeamFlow
            </span>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-foreground leading-tight">
              Welcome back to your
              <span className="text-gradient"> workspace</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Pick up right where you left off. Your projects, your team, your
              flow.
            </p>
          </div>

          {/* Testimonial card */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              "TeamFlow transformed how our team collaborates. We shipped 2x
              faster in our first month."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary to-chart-2 flex items-center justify-center text-xs font-bold text-primary-foreground">
                SC
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Sarah Chen</p>
                <p className="text-xs text-muted-foreground">
                  Engineering Lead, Vercel
                </p>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-8">
            {[
              { value: "10K+", label: "Teams" },
              { value: "99.9%", label: "Uptime" },
              { value: "4.9/5", label: "Rating" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-xl font-bold text-gradient">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div
            className="lg:hidden flex items-center justify-center gap-2.5 mb-4 cursor-pointer"
            onClick={() => navigate({ to: "/" })}
          >
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary to-ring flex items-center justify-center shadow-lg shadow-primary/25">
              <Flag className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">TeamFlow</span>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-foreground mb-2">Sign in</h1>
            <p className="text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Social login */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="bg-card border-border text-muted-foreground hover:bg-accent hover:text-foreground py-5"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              className="bg-card border-border text-muted-foreground hover:bg-accent hover:text-foreground py-5"
            >
              <Github className="w-5 h-5 mr-2" />
              GitHub
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              or continue with email
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3.5 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground text-sm">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          placeholder="name@company.com"
                          type="email"
                          className="pl-10 h-11 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-ring/25 rounded-xl transition-all"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-destructive text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-foreground text-sm">
                        Password
                      </FormLabel>
                      <button
                        type="button"
                        className="text-xs text-primary hover:text-primary/80 transition"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          placeholder="••••••••"
                          type={showPassword ? "text" : "password"}
                          className="pl-10 pr-10 h-11 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-ring/25 rounded-xl transition-all"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3 text-muted-foreground hover:text-foreground transition"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-destructive text-xs" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-linear-to-r from-primary to-chart-2 hover:from-chart-2 hover:to-chart-3 text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 rounded-xl transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              onClick={() => navigate({ to: "/signup" })}
              className="text-primary hover:text-primary/80 font-medium transition"
            >
              Create one free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
