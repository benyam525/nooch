"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Upload,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  Clock,
  Users,
  Shield,
  ChevronRight,
  Play,
  Star,
  Quote,
  Menu,
  X,
  Check,
  Minus,
  Smartphone,
  BarChart3,
  Building2,
  Heart,
  Zap,
  Globe,
} from "lucide-react";

export default function HomePage(): React.JSX.Element {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    // Check if already authenticated
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("nooch-preview-auth");
      if (auth === "true") {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "calimocho") {
      localStorage.setItem("nooch-preview-auth", "true");
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  // Password gate
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-nooch-dark px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-coral-400 to-orange-400">
              <span className="text-2xl font-extrabold text-white">n</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Preview Access</h1>
            <p className="mt-2 text-gray-400">Enter the password to view this site</p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter password"
              className={`w-full rounded-xl border-2 ${error ? "border-red-500" : "border-white/10"} bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-400/20 transition-all`}
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-400">Incorrect password. Try again.</p>
            )}
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-coral-400 to-orange-400 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-coral-400/25"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Close mobile menu when clicking a link
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white">
      {/* Grain overlay */}
      <div className="grain-overlay pointer-events-none fixed inset-0 z-50" />

      {/* Navigation */}
      <nav className="fixed top-0 z-40 w-full border-b border-nooch-light/50 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-coral-400 to-orange-400">
              <span className="text-lg font-extrabold text-white">n</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-nooch-dark">
              nooch
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-nooch-gray transition-colors hover:text-nooch-dark"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-nooch-gray transition-colors hover:text-nooch-dark"
            >
              How It Works
            </Link>
            <Link
              href="/marketplace"
              className="text-sm font-medium text-nooch-gray transition-colors hover:text-nooch-dark"
            >
              Find a Coach
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-nooch-gray transition-colors hover:text-nooch-dark"
            >
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="hidden text-sm font-semibold text-nooch-dark transition-colors hover:text-coral-500 sm:block"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="group hidden items-center gap-2 rounded-xl bg-nooch-dark px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-nooch-dark/90 hover:shadow-lg sm:flex"
            >
              View Demo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-nooch-dark transition-colors hover:bg-coral-50 md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu overlay */}
        <div
          className={`absolute left-0 right-0 top-20 border-b border-nooch-light bg-white/95 backdrop-blur-xl transition-all duration-300 md:hidden ${
            mobileMenuOpen
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-4 opacity-0"
          }`}
        >
          <div className="flex flex-col px-6 py-6">
            <Link
              href="#features"
              onClick={closeMobileMenu}
              className="border-b border-nooch-light/50 py-4 text-base font-medium text-nooch-dark transition-colors hover:text-coral-500"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              onClick={closeMobileMenu}
              className="border-b border-nooch-light/50 py-4 text-base font-medium text-nooch-dark transition-colors hover:text-coral-500"
            >
              How It Works
            </Link>
            <Link
              href="/marketplace"
              onClick={closeMobileMenu}
              className="border-b border-nooch-light/50 py-4 text-base font-medium text-nooch-dark transition-colors hover:text-coral-500"
            >
              Find a Coach
            </Link>
            <Link
              href="#pricing"
              onClick={closeMobileMenu}
              className="border-b border-nooch-light/50 py-4 text-base font-medium text-nooch-dark transition-colors hover:text-coral-500"
            >
              Pricing
            </Link>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/sign-in"
                onClick={closeMobileMenu}
                className="w-full rounded-xl border-2 border-nooch-dark py-3 text-center font-semibold text-nooch-dark transition-all hover:bg-nooch-dark hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                onClick={closeMobileMenu}
                className="w-full rounded-xl bg-gradient-to-r from-coral-400 to-orange-400 py-3 text-center font-semibold text-white shadow-lg shadow-coral-400/25 transition-all hover:shadow-xl"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-20">
        {/* Background gradient mesh */}
        <div className="gradient-mesh absolute inset-0" />

        {/* Animated blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-blob absolute -right-32 -top-32 h-96 w-96 bg-gradient-to-br from-coral-200/40 to-orange-200/40 blur-3xl" />
          <div className="animate-blob animation-delay-400 absolute -left-32 top-1/2 h-80 w-80 bg-gradient-to-br from-coral-100/50 to-coral-200/30 blur-3xl" />
          <div className="animate-blob animation-delay-800 absolute -bottom-32 right-1/4 h-72 w-72 bg-gradient-to-br from-orange-100/40 to-coral-100/40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-8 lg:pt-40">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Left content */}
            <div
              className={`${isLoaded ? "animate-slide-up" : "opacity-0"}`}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-coral-50 px-4 py-2 text-sm font-medium text-coral-600">
                <Sparkles className="h-4 w-4" />
                AI-Powered, Human-Approved
              </div>

              <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight text-nooch-dark sm:text-6xl lg:text-7xl">
                The AI OS for
                <span className="mt-2 block bg-gradient-to-r from-coral-400 to-orange-400 bg-clip-text text-transparent">
                  nutrition coaches
                </span>
                <span className="block font-mono text-xl font-medium text-nooch-gray sm:text-2xl lg:text-3xl">
                  $ scale --keep-personal-touch
                </span>
              </h1>

              <p className="mt-8 max-w-xl text-lg leading-relaxed text-nooch-gray">
                Nooch learns your methodology and responds to clients in your voice—24/7.{" "}
                <span className="font-medium text-nooch-dark">
                  Every response waits for your approval
                </span>
                . Scale your practice without losing what makes you, you.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-coral-400 to-orange-400 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-coral-400/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-coral-400/30"
                >
                  Start coaching smarter
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>

                <button className="group inline-flex items-center justify-center gap-3 rounded-xl border-2 border-nooch-dark/10 bg-white px-8 py-4 text-lg font-semibold text-nooch-dark transition-all duration-300 hover:border-nooch-dark hover:bg-nooch-dark hover:text-white">
                  <Play className="h-5 w-5" />
                  Watch demo
                </button>
              </div>

              {/* Social proof */}
              <div className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-coral-200 to-coral-300 text-xs font-bold text-coral-700"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-nooch-gray">
                    Trusted by <span className="font-semibold text-nooch-dark">500+</span> nutrition coaches
                  </p>
                </div>
              </div>
            </div>

            {/* Right content - Dashboard preview */}
            <div
              className={`relative ${
                isLoaded ? "animate-slide-in-right animation-delay-400" : "opacity-0"
              }`}
            >
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-coral-400/20 to-orange-400/20 blur-2xl" />

                {/* Dashboard mockup card */}
                <div className="relative overflow-hidden rounded-2xl border border-nooch-light bg-white p-1 shadow-2xl">
                  <div className="rounded-xl bg-nooch-light/30 p-4">
                    {/* Browser chrome */}
                    <div className="mb-4 flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-coral-300" />
                      <div className="h-3 w-3 rounded-full bg-amber-300" />
                      <div className="h-3 w-3 rounded-full bg-emerald-300" />
                      <div className="ml-4 h-6 flex-1 rounded-md bg-white/60" />
                    </div>

                    {/* Approval queue mockup */}
                    <div className="space-y-3">
                      <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-coral-100 text-sm font-bold text-coral-600">
                              SJ
                            </div>
                            <div>
                              <p className="font-semibold text-nooch-dark">
                                Sarah Johnson
                              </p>
                              <p className="text-xs text-nooch-gray">
                                2 min ago
                              </p>
                            </div>
                          </div>
                          <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                            Pending
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-nooch-gray">
                          "Hit 140g protein today! Should I increase carbs?"
                        </p>
                        <div className="mt-3 rounded-lg bg-coral-50 p-3">
                          <p className="text-xs font-medium text-coral-600">
                            AI Draft Response
                          </p>
                          <p className="mt-1 text-sm text-nooch-dark">
                            Great job on hitting your protein target! Based on your progress...
                          </p>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button className="flex-1 rounded-lg bg-coral-400 py-2 text-sm font-medium text-white">
                            Approve
                          </button>
                          <button className="flex-1 rounded-lg border border-nooch-light py-2 text-sm font-medium text-nooch-dark">
                            Edit
                          </button>
                        </div>
                      </div>

                      <div className="rounded-xl bg-white/60 p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-nooch-light" />
                          <div className="space-y-2">
                            <div className="h-3 w-24 rounded bg-nooch-light" />
                            <div className="h-2 w-16 rounded bg-nooch-light" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="animate-float absolute -left-8 top-1/4 rounded-xl bg-white p-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-coral-400" />
                    <span className="text-sm font-semibold text-nooch-dark">
                      5 hrs saved/week
                    </span>
                  </div>
                </div>

                <div className="animate-float animation-delay-600 absolute -right-4 bottom-1/4 rounded-xl bg-white p-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-coral-400" />
                    <span className="text-sm font-semibold text-nooch-dark">
                      3x more clients
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-medium text-nooch-gray">
              Scroll to explore
            </span>
            <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-nooch-gray/30 p-1">
              <div className="h-2 w-1 animate-bounce rounded-full bg-coral-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="relative bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <span className="font-mono text-sm text-coral-500">
              $ nooch --problem
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-nooch-dark sm:text-4xl">
              The coaching paradox
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-nooch-gray">
              The more clients you take on, the less personal your coaching becomes.
              Until now.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="relative overflow-hidden rounded-2xl border border-nooch-light bg-gradient-to-br from-coral-50 to-white p-8 text-center">
              <div className="text-6xl font-extrabold text-coral-400 sm:text-7xl">
                85%
              </div>
              <p className="mt-4 text-lg font-medium text-nooch-dark">
                of clients abandon nutrition plans within 3 months
              </p>
              <p className="mt-2 text-sm text-nooch-gray">
                Without consistent support, motivation fades
              </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-nooch-light bg-gradient-to-br from-coral-50 to-white p-8 text-center">
              <div className="text-6xl font-extrabold text-coral-400 sm:text-7xl">
                200M+
              </div>
              <p className="mt-4 text-lg font-medium text-nooch-dark">
                Americans need dietary guidance
              </p>
              <p className="mt-2 text-sm text-nooch-gray">
                There aren't enough coaches to help them all
              </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-nooch-light bg-gradient-to-br from-coral-50 to-white p-8 text-center">
              <div className="text-6xl font-extrabold text-coral-400 sm:text-7xl">
                $40B
              </div>
              <p className="mt-4 text-lg font-medium text-nooch-dark">
                health coaching market by 2032
              </p>
              <p className="mt-2 text-sm text-nooch-gray">
                The opportunity is massive—if you can scale
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Wordplay Section - Full Bleed Coral */}
      <section className="relative overflow-hidden bg-gradient-to-br from-coral-400 to-orange-400 py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
          <div className="inline-flex items-center justify-center gap-4 text-4xl font-extrabold text-white sm:text-5xl md:text-6xl lg:text-7xl">
            <span>nutrition</span>
            <span className="text-white/60">+</span>
            <span>coaching</span>
            <span className="text-white/60">=</span>
            <span className="rounded-xl bg-white/20 px-4 py-2 backdrop-blur-sm">nooch</span>
          </div>
          <p className="mx-auto mt-8 max-w-xl text-xl text-white/90">
            We're building the future of personalized nutrition—where AI amplifies
            human expertise, not replaces it.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative bg-nooch-dark py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-coral-300">
              Why Nooch
            </span>
            <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Everything you need to{" "}
              <span className="font-mono text-coral-300">
                scale_gracefully()
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
              Built by coaches, for coaches. Every feature designed to help you
              serve more clients without sacrificing quality.
            </p>
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Upload,
                title: "Your Methodology, Amplified",
                description:
                  "Upload your meal plans, protocols, and coaching docs. Nooch learns your unique approach and voice.",
                color: "from-coral-400 to-coral-500",
              },
              {
                icon: MessageCircle,
                title: "24/7 Client Support",
                description:
                  "AI responds to client questions instantly, any time of day. No more 2am check-in messages piling up.",
                color: "from-orange-400 to-amber-500",
              },
              {
                icon: Shield,
                title: "Escrow AI Technology",
                description:
                  "Every AI response waits for your approval before reaching clients. You stay in complete control.",
                color: "from-emerald-400 to-teal-500",
              },
              {
                icon: Sparkles,
                title: "Learns Your Voice",
                description:
                  "The more you use it, the better it gets at matching your tone, style, and coaching philosophy.",
                color: "from-violet-400 to-purple-500",
              },
              {
                icon: Clock,
                title: "Save 10+ Hours Weekly",
                description:
                  "Stop typing the same responses. Let AI handle routine questions while you focus on transformations.",
                color: "from-blue-400 to-indigo-500",
              },
              {
                icon: Users,
                title: "Scale to 100+ Clients",
                description:
                  "Coaches using Nooch triple their client roster while improving response times and satisfaction.",
                color: "from-pink-400 to-rose-500",
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
              >
                <div
                  className={`mb-6 inline-flex rounded-xl bg-gradient-to-br ${feature.color} p-3`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-gray-400">{feature.description}</p>
                <div className="absolute -bottom-1 -right-1 h-32 w-32 rounded-full bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Escrow AI Section */}
      <section className="relative overflow-hidden bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-block rounded-full bg-coral-50 px-4 py-2 text-sm font-medium text-coral-600">
                Escrow AI Technology
              </span>
              <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-nooch-dark sm:text-5xl">
                Your AI,{" "}
                <span className="bg-gradient-to-r from-coral-400 to-orange-400 bg-clip-text text-transparent">
                  your rules
                </span>
              </h2>
              <p className="mt-6 text-lg text-nooch-gray">
                Unlike generic chatbots, Nooch's "Escrow AI" holds every response
                until you approve it. Your clients get instant acknowledgment,
                but your expertise is always the final word.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "AI drafts responses using your methodology",
                  "You review, edit, or approve with one tap",
                  "Nothing reaches clients without your sign-off",
                  "Your voice, your brand, your control",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-coral-100">
                      <Check className="h-4 w-4 text-coral-500" />
                    </div>
                    <span className="text-nooch-dark">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Escrow AI Visual */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-coral-100/50 to-orange-100/50 blur-2xl" />
              <div className="relative rounded-2xl border border-nooch-light bg-white p-8 shadow-xl">
                {/* Flow diagram */}
                <div className="flex flex-col items-center gap-4">
                  {/* Client Message */}
                  <div className="w-full rounded-xl bg-coral-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-coral-200">
                        <MessageCircle className="h-5 w-5 text-coral-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-coral-600">Client Message</p>
                        <p className="text-sm text-nooch-dark">"I'm struggling with meal prep..."</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-coral-100">
                    <ChevronRight className="h-4 w-4 rotate-90 text-coral-400" />
                  </div>

                  {/* AI Draft */}
                  <div className="w-full rounded-xl bg-amber-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-200">
                        <Sparkles className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-amber-600">AI Drafts Response</p>
                        <p className="text-sm text-nooch-dark">"Here are 3 batch cooking tips..."</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-coral-100">
                    <ChevronRight className="h-4 w-4 rotate-90 text-coral-400" />
                  </div>

                  {/* Coach Review */}
                  <div className="w-full rounded-xl border-2 border-coral-400 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-coral-400">
                          <Shield className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-coral-600">Coach Reviews</p>
                          <p className="text-sm font-medium text-nooch-dark">You approve or edit</p>
                        </div>
                      </div>
                      <button className="rounded-lg bg-coral-400 px-4 py-2 text-sm font-medium text-white">
                        Approve
                      </button>
                    </div>
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                    <ChevronRight className="h-4 w-4 rotate-90 text-emerald-400" />
                  </div>

                  {/* Sent */}
                  <div className="w-full rounded-xl bg-emerald-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-200">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-emerald-600">Delivered to Client</p>
                        <p className="text-sm text-nooch-dark">Personalized, approved, on-brand</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative overflow-hidden py-32">
        <div className="gradient-mesh absolute inset-0" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block rounded-full bg-coral-50 px-4 py-2 text-sm font-medium text-coral-600">
              How It Works
            </span>
            <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-nooch-dark sm:text-5xl">
              Three steps to{" "}
              <span className="font-mono text-nooch-gray">
                coaching.freedom()
              </span>
            </h2>
          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-3">
            {[
              {
                step: "01",
                title: "Upload Your Methodology",
                description:
                  "Drop in your PDFs, docs, meal templates—anything that defines your coaching approach. Our AI digests it all.",
                visual: (
                  <div className="relative h-48 overflow-hidden rounded-xl bg-gradient-to-br from-coral-50 to-orange-50">
                    <div className="absolute inset-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-coral-200 bg-white/50">
                      <Upload className="h-8 w-8 text-coral-400" />
                      <p className="mt-2 text-sm font-medium text-coral-600">
                        Drop files here
                      </p>
                    </div>
                  </div>
                ),
              },
              {
                step: "02",
                title: "Clients Chat with AI",
                description:
                  "Your clients message through the app. The AI responds in your voice, using your methodology as the foundation.",
                visual: (
                  <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-coral-50 to-orange-50 px-3">
                    <div className="w-full space-y-2.5">
                      <div className="flex justify-end">
                        <div className="rounded-2xl rounded-br-sm bg-coral-400 px-3.5 py-2 text-[13px] leading-snug text-white shadow-sm">
                          Hit 140g protein today!
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-3.5 py-2 text-[13px] leading-snug text-nooch-dark shadow-md">
                          Amazing work! Based on your goals, let's talk about carb timing...
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                step: "03",
                title: "You Approve & Send",
                description:
                  "Review AI drafts in your dashboard. Approve, edit, or add your personal touch. Nothing sends without you.",
                visual: (
                  <div className="relative h-48 overflow-hidden rounded-xl bg-gradient-to-br from-coral-50 to-orange-50 p-4">
                    <div className="rounded-lg bg-white p-3 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-nooch-dark">
                          AI Response Ready
                        </span>
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                          Review
                        </span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button className="flex-1 rounded-lg bg-coral-400 py-2 text-xs font-medium text-white">
                          Approve
                        </button>
                        <button className="flex-1 rounded-lg border border-nooch-light py-2 text-xs font-medium text-nooch-dark">
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ),
              },
            ].map((item, i) => (
              <div key={item.step} className="relative">
                {i < 2 && (
                  <div className="absolute right-0 top-8 hidden h-0.5 w-8 bg-gradient-to-r from-coral-200 to-transparent lg:block" />
                )}
                <div className="mb-6 text-6xl font-extrabold text-coral-100">
                  {item.step}
                </div>
                {item.visual}
                <h3 className="mt-6 text-xl font-bold text-nooch-dark">
                  {item.title}
                </h3>
                <p className="mt-2 text-nooch-gray">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three User Paths Section */}
      <section className="relative bg-nooch-dark py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <span className="font-mono text-sm text-coral-300">
              $ nooch --for everyone
            </span>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Built for the entire ecosystem
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* For Clients */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:border-coral-400/50 hover:bg-white/10">
              <div className="mb-6 inline-flex rounded-xl bg-gradient-to-br from-coral-400 to-orange-400 p-3">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">For Clients</h3>
              <p className="mt-2 font-mono text-sm text-coral-300">
                $ get-guidance --anytime
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "24/7 expert guidance",
                  "Instant, personalized responses",
                  "Track progress easily",
                  "Always feel supported",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300">
                    <Check className="h-4 w-4 text-coral-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="mt-8 inline-flex items-center gap-2 text-coral-400 transition-colors hover:text-coral-300"
              >
                Start your journey
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* For Coaches */}
            <div className="group relative overflow-hidden rounded-2xl border-2 border-coral-400 bg-coral-400/10 p-8 transition-all duration-300 hover:bg-coral-400/20">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-coral-400/20 blur-2xl" />
              <div className="relative">
                <div className="mb-6 inline-flex rounded-xl bg-gradient-to-br from-coral-400 to-orange-400 p-3">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">For Coaches</h3>
                <p className="mt-2 font-mono text-sm text-coral-300">
                  $ scale --without-sacrifice
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "3x your client roster",
                    "Save 10+ hours weekly",
                    "Keep your personal touch",
                    "Full control over AI",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-300">
                      <Check className="h-4 w-4 text-coral-400" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/dashboard"
                  className="mt-8 inline-flex items-center gap-2 rounded-lg bg-coral-400 px-4 py-2 font-medium text-white transition-colors hover:bg-coral-500"
                >
                  View demo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* For Enterprise */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:border-coral-400/50 hover:bg-white/10">
              <div className="mb-6 inline-flex rounded-xl bg-gradient-to-br from-coral-400 to-orange-400 p-3">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">For Enterprise</h3>
              <p className="mt-2 font-mono text-sm text-coral-300">
                $ deploy --at-scale
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "White-label solutions",
                  "API integrations",
                  "Dedicated support",
                  "Custom compliance",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300">
                    <Check className="h-4 w-4 text-coral-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="#pricing"
                className="mt-8 inline-flex items-center gap-2 text-coral-400 transition-colors hover:text-coral-300"
              >
                Contact sales
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="relative overflow-hidden py-24">
        <div className="gradient-mesh absolute inset-0" />
        <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block rounded-full bg-coral-50 px-4 py-2 text-sm font-medium text-coral-600">
              Comparison
            </span>
            <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-nooch-dark sm:text-5xl">
              Why coaches choose Nooch
            </h2>
          </div>

          <div className="mt-12 overflow-hidden rounded-2xl border border-nooch-light bg-white shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-nooch-light bg-nooch-light/30">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-nooch-dark">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-nooch-gray">
                      Generic Chatbots
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-nooch-gray">
                      Manual Coaching
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                      <span className="rounded-lg bg-gradient-to-r from-coral-400 to-orange-400 px-3 py-1">
                        Nooch
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Personal Touch", generic: false, manual: true, nooch: true },
                    { feature: "24/7 Availability", generic: true, manual: false, nooch: true },
                    { feature: "Coach Control", generic: false, manual: true, nooch: true },
                    { feature: "Scalability", generic: true, manual: false, nooch: true },
                    { feature: "Learns Your Style", generic: false, manual: "N/A", nooch: true },
                    { feature: "Client Satisfaction", generic: false, manual: true, nooch: true },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-nooch-light/10"}>
                      <td className="px-6 py-4 text-sm font-medium text-nooch-dark">
                        {row.feature}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {row.generic === true ? (
                          <Check className="mx-auto h-5 w-5 text-emerald-500" />
                        ) : row.generic === false ? (
                          <Minus className="mx-auto h-5 w-5 text-nooch-gray/40" />
                        ) : (
                          <span className="text-xs text-nooch-gray">{row.generic}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {row.manual === true ? (
                          <Check className="mx-auto h-5 w-5 text-emerald-500" />
                        ) : row.manual === false ? (
                          <Minus className="mx-auto h-5 w-5 text-nooch-gray/40" />
                        ) : (
                          <span className="text-xs text-nooch-gray">{row.manual}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-coral-100">
                            <Check className="h-4 w-4 text-coral-500" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative bg-coral-50 py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block rounded-full bg-coral-100 px-4 py-2 text-sm font-medium text-coral-600">
              Testimonials
            </span>
            <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-nooch-dark sm:text-5xl">
              Coaches{" "}
              <span className="rounded bg-coral-100 px-2 py-1 font-mono text-coral-500">
                love
              </span>{" "}
              Nooch
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                quote:
                  "I went from 15 clients to 45 in three months. The AI captures my coaching style perfectly—clients can't even tell the difference.",
                author: "Jessica Martinez",
                role: "Certified Nutritionist",
                metric: "3x clients",
              },
              {
                quote:
                  "The approval system is genius. I stay in control while saving 10+ hours a week on routine questions. Game changer for my practice.",
                author: "David Chen",
                role: "Sports Nutrition Coach",
                metric: "10 hrs/week saved",
              },
              {
                quote:
                  "My response time went from 24 hours to under an hour. Clients are happier, and I finally have weekends again.",
                author: "Sarah Thompson",
                role: "Holistic Health Coach",
                metric: "24x faster",
              },
            ].map((testimonial, i) => (
              <div
                key={testimonial.author}
                className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm"
              >
                <Quote className="absolute -right-4 -top-4 h-24 w-24 text-coral-100" />
                <div className="relative">
                  <div className="mb-4 inline-block rounded-full bg-gradient-to-r from-coral-400 to-orange-400 px-3 py-1 text-sm font-semibold text-white">
                    {testimonial.metric}
                  </div>
                  <p className="text-lg text-nooch-gray">
                    "{testimonial.quote}"
                  </p>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-coral-200 to-coral-300 font-bold text-coral-700">
                      {testimonial.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-nooch-dark">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-nooch-gray">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-32">
        <div className="gradient-mesh absolute inset-0" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block rounded-full bg-coral-50 px-4 py-2 text-sm font-medium text-coral-600">
              Pricing
            </span>
            <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-nooch-dark sm:text-5xl">
              Simple,{" "}
              <span className="font-mono text-nooch-gray">
                --transparent
              </span>{" "}
              pricing
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-nooch-gray">
              Start free, scale as you grow. No hidden fees, no surprises.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "Free",
                description: "Perfect for trying Nooch",
                features: [
                  "Up to 5 clients",
                  "Basic AI responses",
                  "Email support",
                  "1 methodology document",
                ],
                cta: "Start for free",
                highlighted: false,
              },
              {
                name: "Professional",
                price: "$49",
                period: "/month",
                description: "For growing practices",
                features: [
                  "Up to 50 clients",
                  "Advanced AI with your voice",
                  "Priority support",
                  "Unlimited documents",
                  "Analytics dashboard",
                  "Custom approval workflows",
                ],
                cta: "Start free trial",
                highlighted: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large practices & teams",
                features: [
                  "Unlimited clients",
                  "White-label options",
                  "Dedicated success manager",
                  "API access",
                  "Custom integrations",
                  "SLA guarantee",
                ],
                cta: "Contact sales",
                highlighted: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative overflow-hidden rounded-2xl ${
                  plan.highlighted
                    ? "border-2 border-coral-400 bg-white shadow-xl shadow-coral-400/10"
                    : "border border-nooch-light bg-white"
                } p-8`}
              >
                {plan.highlighted && (
                  <div className="absolute -right-12 top-6 rotate-45 bg-gradient-to-r from-coral-400 to-orange-400 px-12 py-1 text-xs font-semibold text-white">
                    Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-nooch-dark">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-nooch-gray">
                  {plan.description}
                </p>
                <div className="mt-6">
                  <span className="text-4xl font-extrabold text-nooch-dark">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-nooch-gray">{plan.period}</span>
                  )}
                </div>
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm text-nooch-gray"
                    >
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-coral-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-8 w-full rounded-xl py-3 font-semibold transition-all duration-300 ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-coral-400 to-orange-400 text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-coral-400/25"
                      : "border-2 border-nooch-dark text-nooch-dark hover:bg-nooch-dark hover:text-white"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section - Full Bleed Coral */}
      <section className="relative overflow-hidden bg-gradient-to-br from-coral-400 via-coral-500 to-orange-400 py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

        {/* Decorative arrows */}
        <div className="absolute left-8 top-1/2 hidden -translate-y-1/2 lg:block">
          <ChevronRight className="h-16 w-16 text-white/10" />
          <ChevronRight className="h-16 w-16 -mt-8 ml-4 text-white/20" />
          <ChevronRight className="h-16 w-16 -mt-8 ml-8 text-white/10" />
        </div>
        <div className="absolute right-8 top-1/2 hidden -translate-y-1/2 rotate-180 lg:block">
          <ChevronRight className="h-16 w-16 text-white/10" />
          <ChevronRight className="h-16 w-16 -mt-8 ml-4 text-white/20" />
          <ChevronRight className="h-16 w-16 -mt-8 ml-8 text-white/10" />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
          <Globe className="mx-auto h-16 w-16 text-white/80" />
          <h2 className="mt-8 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            We start with coaches.
            <span className="mt-2 block">We scale to nations.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-xl text-white/90">
            Democratizing wellness, one conversation at a time. Our mission is to
            make expert nutrition guidance accessible to everyone—powered by AI,
            guided by humans.
          </p>
          <div className="mt-12 font-mono text-lg text-white/70">
            {">"} democratize_wellness --mission
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative overflow-hidden bg-nooch-dark py-32">
        {/* Decorative elements */}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-coral-400/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-orange-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Ready to{" "}
            <span className="bg-gradient-to-r from-coral-400 to-orange-400 bg-clip-text text-transparent">
              scale smarter
            </span>
            ?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-400">
            Join 500+ nutrition coaches who've reclaimed their time while
            growing their practice. Start your free trial today.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-coral-400 to-orange-400 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-coral-400/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-coral-400/30"
            >
              Start free trial
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#"
              className="inline-flex items-center gap-2 text-lg font-semibold text-gray-400 transition-colors hover:text-white"
            >
              Schedule a demo
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-nooch-light bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-coral-400 to-orange-400">
                  <span className="text-lg font-extrabold text-white">n</span>
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-nooch-dark">
                  nooch
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-nooch-gray">
                The AI-powered operating system for nutrition coaches.
              </p>
              <p className="mt-2 font-mono text-sm text-coral-400">
                {">"} scale --keep-personal-touch
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-nooch-dark">Product</h4>
              <ul className="mt-4 space-y-3 text-sm text-nooch-gray">
                <li>
                  <Link href="#features" className="hover:text-coral-500">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-coral-500">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-coral-500">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-coral-500">
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-nooch-dark">Company</h4>
              <ul className="mt-4 space-y-3 text-sm text-nooch-gray">
                <li>
                  <Link href="#" className="hover:text-coral-500">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-coral-500">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-coral-500">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-coral-500">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-nooch-light pt-8">
            <p className="text-center text-sm text-nooch-gray">
              &copy; {new Date().getFullYear()} Nooch. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
