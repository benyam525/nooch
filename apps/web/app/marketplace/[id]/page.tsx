"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Star,
  Users,
  CheckCircle2,
  MapPin,
  Clock,
  Calendar,
  Shield,
  Award,
  MessageCircle,
  Heart,
  Share2,
  ChevronRight,
  Sparkles,
  FileText,
  Target,
  Zap,
  Quote,
} from "lucide-react";

interface Coach {
  id: string;
  firstName: string;
  lastName: string;
  imageUrl: string | null;
  specialty: string;
  secondarySpecialties: string[];
  bio: string;
  clientCount: number;
  maxClients: number;
  rating: number;
  reviewCount: number;
  pricePerMonth: number;
  location: string;
  responseTime: string;
  verified: boolean;
  yearsExperience: number;
  certifications: string[];
  methodology: string[];
  languages: string[];
  availableSlots: number;
  nextAvailable: string;
  totalClients: number;
  successRate: number;
}

// Demo coach data (in real app, this would be fetched)
const coachesData: Record<string, Coach> = {
  "1": {
    id: "1",
    firstName: "Jessica",
    lastName: "Martinez",
    imageUrl: null,
    specialty: "Weight Loss",
    secondarySpecialties: ["Meal Planning", "Habit Building", "Mindful Eating"],
    bio: "I'm a certified nutritionist with over 8 years of experience helping clients achieve sustainable weight loss through balanced eating and lifestyle changes. I believe in building habits that last, not quick fixes or fad diets.\n\nMy approach combines evidence-based nutrition science with behavioral psychology to help you understand not just what to eat, but why you eat. Together, we'll create a personalized plan that fits your lifestyle, preferences, and goals.\n\nI've helped over 200 clients lose weight and keep it off. My clients range from busy professionals to new parents to athletes looking to optimize their body composition. No matter where you're starting from, I'm here to guide you every step of the way.",
    clientCount: 47,
    maxClients: 50,
    rating: 4.9,
    reviewCount: 38,
    pricePerMonth: 199,
    location: "Los Angeles, CA",
    responseTime: "< 2 hours",
    verified: true,
    yearsExperience: 8,
    certifications: ["Certified Nutrition Specialist (CNS)", "NASM Certified", "Precision Nutrition Level 2"],
    methodology: [
      "Personalized macro calculations based on your goals and activity level",
      "Weekly meal planning with flexible food choices",
      "Habit-based approach focusing on one change at a time",
      "Regular check-ins and plan adjustments based on progress",
      "Mindful eating techniques to improve your relationship with food",
    ],
    languages: ["English", "Spanish"],
    availableSlots: 3,
    nextAvailable: "Within 1 week",
    totalClients: 215,
    successRate: 94,
  },
  "2": {
    id: "2",
    firstName: "David",
    lastName: "Chen",
    imageUrl: null,
    specialty: "Sports Nutrition",
    secondarySpecialties: ["Performance", "Muscle Building", "Competition Prep"],
    bio: "Former collegiate athlete turned nutrition coach. I understand firsthand the demands of athletic performance and how proper nutrition can be the difference between good and great.\n\nI specialize in helping athletes and fitness enthusiasts optimize their nutrition for peak performance, whether you're training for a marathon, preparing for a competition, or simply want to get stronger and faster.\n\nMy science-based approach focuses on nutrient timing, macronutrient optimization, and supplementation strategies tailored to your specific sport and goals.",
    clientCount: 32,
    maxClients: 40,
    rating: 4.8,
    reviewCount: 29,
    pricePerMonth: 249,
    location: "Austin, TX",
    responseTime: "< 4 hours",
    verified: true,
    yearsExperience: 6,
    certifications: ["CISSN (Certified Sports Nutritionist)", "CSCS", "Precision Nutrition Level 1"],
    methodology: [
      "Sport-specific nutrition periodization",
      "Pre/intra/post workout nutrition optimization",
      "Body composition tracking and adjustments",
      "Supplement protocol customization",
      "Competition day nutrition planning",
    ],
    languages: ["English", "Mandarin"],
    availableSlots: 8,
    nextAvailable: "Immediately",
    totalClients: 180,
    successRate: 91,
  },
  "3": {
    id: "3",
    firstName: "Sarah",
    lastName: "Thompson",
    imageUrl: null,
    specialty: "Holistic Nutrition",
    secondarySpecialties: ["Gut Health", "Anti-Inflammatory", "Hormone Balance"],
    bio: "As an integrative nutrition specialist, I take a whole-body approach to health and wellness. I believe that true health comes from addressing the root causes of imbalance, not just treating symptoms.\n\nWith a Master's degree in Clinical Nutrition and certification in Functional Medicine, I help clients heal their gut, balance their hormones, and reduce inflammation through targeted nutrition strategies.\n\nMy practice combines traditional nutrition science with holistic principles, focusing on nutrient-dense whole foods, stress management, and lifestyle factors that impact your health.",
    clientCount: 28,
    maxClients: 35,
    rating: 5.0,
    reviewCount: 24,
    pricePerMonth: 279,
    location: "Denver, CO",
    responseTime: "< 1 hour",
    verified: true,
    yearsExperience: 10,
    certifications: ["MS, RDN", "IFNCP (Functional Nutrition)", "Certified LEAP Therapist"],
    methodology: [
      "Comprehensive health history and symptom assessment",
      "Elimination and reintroduction protocols",
      "Gut healing nutrition protocols",
      "Anti-inflammatory meal planning",
      "Stress and sleep optimization strategies",
    ],
    languages: ["English"],
    availableSlots: 7,
    nextAvailable: "Within 2 weeks",
    totalClients: 150,
    successRate: 96,
  },
};

// Demo reviews
const reviewsData = [
  {
    id: "r1",
    coachId: "1",
    clientName: "Michelle R.",
    clientSince: "8 months",
    rating: 5,
    date: "2 weeks ago",
    content: "Jessica completely changed my relationship with food. After years of yo-yo dieting, I've finally found an approach that works for me. Down 35 lbs and feeling amazing!",
    verified: true,
  },
  {
    id: "r2",
    coachId: "1",
    clientName: "Robert K.",
    clientSince: "4 months",
    rating: 5,
    date: "1 month ago",
    content: "The AI responses are incredibly helpful for quick questions, and knowing Jessica reviews everything gives me confidence in the advice. Best investment I've made in my health.",
    verified: true,
  },
  {
    id: "r3",
    coachId: "1",
    clientName: "Amanda L.",
    clientSince: "6 months",
    rating: 4,
    date: "3 weeks ago",
    content: "Great coach with a realistic approach. She helped me lose 20 lbs while still enjoying my favorite foods. The meal planning feature is a game-changer for busy weeks.",
    verified: true,
  },
  {
    id: "r4",
    coachId: "1",
    clientName: "James T.",
    clientSince: "1 year",
    rating: 5,
    date: "2 months ago",
    content: "I was skeptical about online coaching but Jessica proved me wrong. Her personalized approach and quick responses made all the difference. Lost 50 lbs and maintained it!",
    verified: true,
  },
];

const defaultCoach = coachesData["1"]!;

export default function CoachProfilePage(): React.JSX.Element {
  const params = useParams();
  const coachId = params.id as string;
  const coach = coachesData[coachId] ?? defaultCoach;
  const reviews = reviewsData.filter((r) => r.coachId === coachId || coachId === "1");

  const [activeTab, setActiveTab] = useState<"about" | "methodology" | "reviews">("about");
  const [showBookingModal, setShowBookingModal] = useState(false);

  const availability = coach.maxClients - coach.clientCount;
  const availabilityPercent = (coach.clientCount / coach.maxClients) * 100;

  return (
    <div className="min-h-screen bg-nooch-light/30">
      {/* Header */}
      <div className="border-b border-nooch-light bg-white">
        <div className="mx-auto max-w-5xl px-6 py-4 lg:px-8">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-sm font-medium text-nooch-gray transition-colors hover:text-nooch-dark"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Link>
        </div>
      </div>

      {/* Profile Header */}
      <div className="border-b border-nooch-light bg-white">
        <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            {/* Left: Profile Info */}
            <div className="flex items-start gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-coral-200 to-coral-300 text-3xl font-bold text-coral-700 md:h-32 md:w-32">
                {coach.firstName[0]}{coach.lastName[0]}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-extrabold text-nooch-dark md:text-3xl">
                    {coach.firstName} {coach.lastName}
                  </h1>
                  {coach.verified && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="mt-1 text-lg font-medium text-coral-500">
                  {coach.specialty} Specialist
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-nooch-gray">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {coach.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    Responds {coach.responseTime}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Award className="h-4 w-4" />
                    {coach.yearsExperience} years experience
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-nooch-dark">{coach.rating}</span>
                    <span className="text-nooch-gray">({coach.reviewCount} reviews)</span>
                  </div>
                  <span className="text-nooch-gray">•</span>
                  <span className="flex items-center gap-1.5 text-nooch-gray">
                    <Users className="h-4 w-4" />
                    {coach.totalClients}+ clients helped
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-nooch-light text-nooch-gray transition-colors hover:border-coral-400 hover:text-coral-500">
                <Heart className="h-5 w-5" />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-nooch-light text-nooch-gray transition-colors hover:border-coral-400 hover:text-coral-500">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Specialties */}
          <div className="mt-6 flex flex-wrap gap-2">
            {coach.secondarySpecialties.map((specialty) => (
              <span
                key={specialty}
                className="rounded-full bg-coral-50 px-3 py-1.5 text-sm font-medium text-coral-600"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-1 rounded-xl bg-nooch-light/50 p-1">
              {[
                { id: "about", label: "About", icon: FileText },
                { id: "methodology", label: "Methodology", icon: Target },
                { id: "reviews", label: "Reviews", icon: MessageCircle },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-white text-nooch-dark shadow-sm"
                      : "text-nooch-gray hover:text-nooch-dark"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === "about" && (
                <div className="space-y-6">
                  {/* Bio */}
                  <div className="rounded-2xl border border-nooch-light bg-white p-6">
                    <h2 className="text-lg font-bold text-nooch-dark">About {coach.firstName}</h2>
                    <div className="mt-4 space-y-4 text-nooch-gray">
                      {coach.bio.split("\n\n").map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="rounded-2xl border border-nooch-light bg-white p-6">
                    <h2 className="text-lg font-bold text-nooch-dark">Certifications & Credentials</h2>
                    <ul className="mt-4 space-y-3">
                      {coach.certifications.map((cert, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-coral-50">
                            <Award className="h-4 w-4 text-coral-500" />
                          </div>
                          <span className="text-nooch-dark">{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Languages */}
                  <div className="rounded-2xl border border-nooch-light bg-white p-6">
                    <h2 className="text-lg font-bold text-nooch-dark">Languages</h2>
                    <div className="mt-4 flex gap-2">
                      {coach.languages.map((lang) => (
                        <span
                          key={lang}
                          className="rounded-full bg-nooch-light px-3 py-1.5 text-sm font-medium text-nooch-dark"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "methodology" && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-nooch-light bg-white p-6">
                    <h2 className="text-lg font-bold text-nooch-dark">My Coaching Approach</h2>
                    <p className="mt-2 text-nooch-gray">
                      Here's what you can expect when working with me:
                    </p>
                    <ul className="mt-6 space-y-4">
                      {coach.methodology.map((item, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-coral-100 text-sm font-bold text-coral-600">
                            {i + 1}
                          </div>
                          <span className="pt-1 text-nooch-dark">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* AI Integration */}
                  <div className="rounded-2xl border-2 border-coral-200 bg-gradient-to-br from-coral-50 to-orange-50 p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral-400">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-nooch-dark">AI-Powered Support</h3>
                        <p className="text-sm text-nooch-gray">Escrow AI Technology</p>
                      </div>
                    </div>
                    <p className="mt-4 text-nooch-gray">
                      As a Nooch coach, I use AI to provide you with instant responses to your questions 24/7.
                      The AI is trained on my methodology, so responses always align with my coaching approach.
                      <span className="font-medium text-nooch-dark"> Every AI response is reviewed and approved by me
                      before you receive it.</span>
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-coral-500" />
                      <span className="text-coral-600 font-medium">Human-approved, AI-powered</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {/* Review Stats */}
                  <div className="rounded-2xl border border-nooch-light bg-white p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-4xl font-extrabold text-nooch-dark">{coach.rating}</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-5 w-5 ${
                                  star <= Math.round(coach.rating)
                                    ? "fill-amber-400 text-amber-400"
                                    : "fill-nooch-light text-nooch-light"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-nooch-gray">
                          Based on {coach.reviewCount} verified reviews
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-500">{coach.successRate}%</div>
                        <p className="text-sm text-nooch-gray">Success rate</p>
                      </div>
                    </div>
                  </div>

                  {/* Verified Reviews Note */}
                  <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-amber-600" />
                    <span className="text-amber-800">
                      Only clients with 30+ days experience can leave reviews
                    </span>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="rounded-2xl border border-nooch-light bg-white p-6"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-coral-100 font-bold text-coral-600">
                              {review.clientName[0]}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-nooch-dark">
                                  {review.clientName}
                                </span>
                                {review.verified && (
                                  <span className="flex items-center gap-1 text-xs text-emerald-600">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Verified
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-nooch-gray">
                                Client for {review.clientSince}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "fill-nooch-light text-nooch-light"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-4 text-nooch-gray">{review.content}</p>
                        <p className="mt-3 text-xs text-nooch-gray">{review.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Pricing Card */}
              <div className="rounded-2xl border border-nooch-light bg-white p-6 shadow-sm">
                <div className="text-center">
                  <span className="text-4xl font-extrabold text-nooch-dark">
                    ${coach.pricePerMonth}
                  </span>
                  <span className="text-nooch-gray">/month</span>
                </div>

                <div className="mt-6 space-y-4">
                  {/* Availability */}
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-nooch-gray">Availability</span>
                      <span className={`font-medium ${availability > 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {availability > 0 ? `${availability} spots left` : "Waitlist only"}
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-nooch-light">
                      <div
                        className={`h-full rounded-full transition-all ${
                          availabilityPercent > 90
                            ? "bg-red-400"
                            : availabilityPercent > 70
                            ? "bg-amber-400"
                            : "bg-emerald-400"
                        }`}
                        style={{ width: `${availabilityPercent}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-nooch-gray">
                      {coach.clientCount} of {coach.maxClients} clients
                    </p>
                  </div>

                  {/* Next Available */}
                  <div className="flex items-center justify-between rounded-lg bg-nooch-light/50 px-4 py-3">
                    <span className="text-sm text-nooch-gray">Next available</span>
                    <span className="text-sm font-medium text-nooch-dark">{coach.nextAvailable}</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="w-full rounded-xl bg-coral-400 py-3.5 font-semibold text-white transition-all hover:bg-coral-500"
                  >
                    Book Free Consultation
                  </button>
                  <button className="w-full rounded-xl border-2 border-nooch-dark py-3.5 font-semibold text-nooch-dark transition-all hover:bg-nooch-dark hover:text-white">
                    Message {coach.firstName}
                  </button>
                </div>

                <p className="mt-4 text-center text-xs text-nooch-gray">
                  Free 15-minute consultation to see if we're a good fit
                </p>
              </div>

              {/* What's Included */}
              <div className="rounded-2xl border border-nooch-light bg-white p-6">
                <h3 className="font-bold text-nooch-dark">What's Included</h3>
                <ul className="mt-4 space-y-3">
                  {[
                    "Personalized nutrition plan",
                    "24/7 AI-powered support",
                    "Weekly check-ins & adjustments",
                    "Meal planning assistance",
                    "Progress tracking dashboard",
                    "Direct messaging with coach",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-coral-400" />
                      <span className="text-nooch-gray">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 rounded-xl bg-nooch-light/30 px-4 py-3">
                <div className="flex items-center gap-1.5 text-xs text-nooch-gray">
                  <Shield className="h-4 w-4 text-coral-400" />
                  <span>Verified Coach</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-nooch-gray">
                  <Zap className="h-4 w-4 text-coral-400" />
                  <span>AI-Powered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-nooch-dark">Book a Consultation</h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-nooch-gray hover:text-nooch-dark"
              >
                <ChevronRight className="h-5 w-5 rotate-90" />
              </button>
            </div>

            <p className="mt-2 text-nooch-gray">
              Schedule a free 15-minute call with {coach.firstName} to discuss your goals.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-nooch-dark">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-nooch-light px-4 py-2.5 focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-400/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-nooch-dark">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-nooch-light px-4 py-2.5 focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-400/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-nooch-dark">
                  What are your goals?
                </label>
                <textarea
                  placeholder="Tell us briefly about your health and nutrition goals..."
                  rows={3}
                  className="w-full rounded-lg border border-nooch-light px-4 py-2.5 focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-400/20"
                />
              </div>
            </div>

            <button
              onClick={() => setShowBookingModal(false)}
              className="mt-6 w-full rounded-xl bg-coral-400 py-3 font-semibold text-white transition-all hover:bg-coral-500"
            >
              Request Consultation
            </button>

            <p className="mt-4 text-center text-xs text-nooch-gray">
              {coach.firstName} will reach out within {coach.responseTime} to schedule your call
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
