import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Mail, Lock, User, AlertCircle, Flag, ArrowRight, Github, Eye, EyeOff, CheckCircle2, Zap, Shield, Users } from 'lucide-react'
import { useState } from 'react'

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password confirmation is required'),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SignupFormValues = z.infer<typeof signupSchema>

export const Route = createFileRoute('/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  })

  /* Live password strength */
  const watchPw = form.watch('password')
  const pwStrength = (() => {
    let s = 0
    if (watchPw.length >= 6) s++
    if (watchPw.length >= 10) s++
    if (/[A-Z]/.test(watchPw) && /[a-z]/.test(watchPw)) s++
    if (/\d/.test(watchPw)) s++
    if (/[^a-zA-Z0-9]/.test(watchPw)) s++
    return s
  })()
  const pwLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'][pwStrength] ?? ''
  const pwColor = ['bg-slate-700', 'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-emerald-500', 'bg-emerald-400'][pwStrength]

  async function onSubmit(values: SignupFormValues) {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Signup failed')
      }

      const data = await response.json()
      localStorage.setItem('token', data.token)
      navigate({ to: '/' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex noise-overlay relative">
      {/* Ambient orbs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-15%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[140px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-indigo-500/15 blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Left decorative panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-indigo-600/10" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-purple-500/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/3 w-56 h-56 rounded-full bg-indigo-500/10 blur-[80px]" />

        <div className="relative z-10 max-w-md space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate({ to: '/' })}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Flag className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">TeamFlow</span>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Start building with your
              <span className="text-gradient"> dream team</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Set up in under 2 minutes. No credit card required. Unlimited projects on the free plan.
            </p>
          </div>

          {/* Perks list */}
          <div className="space-y-4">
            {[
              { icon: Zap, text: 'Instant project setup — start in seconds' },
              { icon: Users, text: 'Invite your whole team for free' },
              { icon: Shield, text: 'Enterprise-grade security from day one' },
              { icon: CheckCircle2, text: '14-day Pro trial included, no strings' },
            ].map((p, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <p.icon className="w-4 h-4 text-indigo-400" />
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex -space-x-2">
              {['bg-violet-500', 'bg-cyan-500', 'bg-amber-500', 'bg-rose-500'].map((bg, i) => (
                <div key={i} className={`w-8 h-8 rounded-full ${bg} border-2 border-[#0a0a0f] flex items-center justify-center text-xs font-semibold text-white`}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500">Join <span className="text-white font-medium">10,000+</span> teams</p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md space-y-7">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-4 cursor-pointer" onClick={() => navigate({ to: '/' })}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Flag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">TeamFlow</span>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-slate-500">Free forever. Upgrade anytime.</p>
          </div>

          {/* Social login */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.06] hover:text-white py-5">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </Button>
            <Button variant="outline" className="bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.06] hover:text-white py-5">
              <Github className="w-5 h-5 mr-2" />
              GitHub
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-slate-600 uppercase tracking-wider">or continue with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300 text-sm">Full Name</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                        <Input
                          placeholder="John Doe"
                          className="pl-10 h-11 bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 rounded-xl transition-all"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300 text-sm">Work Email</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                        <Input
                          placeholder="name@company.com"
                          type="email"
                          className="pl-10 h-11 bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 rounded-xl transition-all"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300 text-sm">Password</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                        <Input
                          placeholder="Min. 6 characters"
                          type={showPassword ? 'text' : 'password'}
                          className="pl-10 pr-10 h-11 bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 rounded-xl transition-all"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3 text-slate-600 hover:text-slate-400 transition"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </FormControl>
                    {/* Strength meter */}
                    {watchPw.length > 0 && (
                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex gap-1 flex-1">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < pwStrength ? pwColor : 'bg-white/10'}`} />
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-500">{pwLabel}</span>
                      </div>
                    )}
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300 text-sm">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                        <Input
                          placeholder="••••••••"
                          type={showConfirm ? 'text' : 'password'}
                          className="pl-10 pr-10 h-11 bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 rounded-xl transition-all"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3.5 top-3 text-slate-600 hover:text-slate-400 transition"
                        >
                          {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-1">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-white/20 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500 mt-0.5"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm text-slate-400 font-normal cursor-pointer">
                        I agree to the{' '}
                        <a href="#" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">Privacy Policy</a>
                      </FormLabel>
                      <FormMessage className="text-red-400 text-xs" />
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 rounded-xl transition-all mt-2"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account…
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <p className="text-center text-sm text-slate-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate({ to: '/login' })}
              className="text-indigo-400 hover:text-indigo-300 font-medium transition"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
