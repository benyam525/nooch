"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, CheckCircle2, Sparkles } from "lucide-react";

export default function SignUpPage(): React.JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const passwordStrength = () => {
    const { password } = formData;
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return 4;
    return 3;
  };

  const strengthColors = ["bg-nooch-light", "bg-coral-400", "bg-amber-400", "bg-emerald-400", "bg-emerald-500"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className="relative flex min-h-screen">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:bg-nooch-dark lg:px-16">
        <div className="relative">
          {/* Decorative blobs */}
          <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-coral-400/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-orange-400/10 blur-3xl" />

          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-coral-300">
              <Sparkles className="h-4 w-4" />
              Join 500+ nutrition coaches
            </div>

            <h2 className="text-4xl font-extrabold leading-tight text-white">
              Start scaling
              <span className="mt-2 block bg-gradient-to-r from-coral-400 to-orange-400 bg-clip-text text-transparent">
                your practice today
              </span>
            </h2>

            <p className="mt-6 max-w-md text-lg text-gray-400">
              <span className="font-mono text-coral-400">{">"}</span>{" "}
              <span className="font-mono text-gray-300">
                Free to start. No credit card required. Setup in under 5 minutes.
              </span>
            </p>

            {/* What you get */}
            <div className="mt-10 space-y-4">
              {[
                "Upload unlimited methodology docs",
                "AI learns your coaching voice",
                "Review & approve all responses",
                "Scale to 5 clients free",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-coral-400" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            {/* Terminal-style initialization */}
            <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-6 font-mono text-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-coral-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-gray-500">init_coach.sh</span>
              </div>
              <div className="space-y-2 text-gray-300">
                <p>
                  <span className="text-coral-400">$</span> nooch init --new-coach
                </p>
                <p className="text-gray-500">Initializing your coaching AI...</p>
                <p className="text-emerald-400">✓ Ready to transform your practice</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="mb-12 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-coral-400 to-orange-400">
              <span className="text-lg font-extrabold text-white">n</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-nooch-dark">
              nooch
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-nooch-dark">
              Create your account
            </h1>
            <p className="mt-2 text-nooch-gray">
              <span className="font-mono text-coral-500">$</span>{" "}
              <span className="font-mono text-nooch-gray/80">
                nooch signup --role=coach
              </span>
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-sm font-medium text-nooch-dark"
                >
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  placeholder="Jane"
                  className="w-full rounded-xl border-2 border-nooch-light bg-white px-4 py-3 text-nooch-dark placeholder:text-nooch-gray/50 focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-400/20 transition-all"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-sm font-medium text-nooch-dark"
                >
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  placeholder="Smith"
                  className="w-full rounded-xl border-2 border-nooch-light bg-white px-4 py-3 text-nooch-dark placeholder:text-nooch-gray/50 focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-400/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-nooch-dark"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="coach@example.com"
                className="w-full rounded-xl border-2 border-nooch-light bg-white px-4 py-3 text-nooch-dark placeholder:text-nooch-gray/50 focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-400/20 transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-nooch-dark"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full rounded-xl border-2 border-nooch-light bg-white px-4 py-3 pr-12 text-nooch-dark placeholder:text-nooch-gray/50 focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-400/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-nooch-gray hover:text-nooch-dark transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          passwordStrength() >= level
                            ? strengthColors[passwordStrength()]
                            : "bg-nooch-light"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-nooch-gray">
                    Password strength:{" "}
                    <span
                      className={
                        passwordStrength() >= 3
                          ? "text-emerald-500"
                          : passwordStrength() >= 2
                          ? "text-amber-500"
                          : "text-coral-500"
                      }
                    >
                      {strengthLabels[passwordStrength()]}
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 h-4 w-4 rounded border-nooch-light text-coral-400 focus:ring-coral-400"
              />
              <label htmlFor="terms" className="text-sm text-nooch-gray">
                I agree to the{" "}
                <Link href="/terms" className="text-coral-500 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-coral-500 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-coral-400 to-orange-400 py-3.5 font-semibold text-white shadow-lg shadow-coral-400/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-coral-400/30"
            >
              Create account
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-nooch-light" />
            <span className="text-sm text-nooch-gray">or continue with</span>
            <div className="h-px flex-1 bg-nooch-light" />
          </div>

          {/* Social login */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 rounded-xl border-2 border-nooch-light py-3 font-medium text-nooch-dark transition-all hover:border-nooch-dark hover:bg-nooch-dark hover:text-white">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
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
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl border-2 border-nooch-light py-3 font-medium text-nooch-dark transition-all hover:border-nooch-dark hover:bg-nooch-dark hover:text-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </button>
          </div>

          {/* Sign in link */}
          <p className="mt-8 text-center text-nooch-gray">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-coral-500 hover:text-coral-600 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
