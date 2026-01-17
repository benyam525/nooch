"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Star,
  Users,
  CheckCircle2,
  MapPin,
  Clock,
  ChevronDown,
  X,
  Shield,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// Demo coach data
const demoCoaches = [
  {
    id: "1",
    firstName: "Jessica",
    lastName: "Martinez",
    imageUrl: null,
    specialty: "Weight Loss",
    secondarySpecialties: ["Meal Planning", "Habit Building"],
    bio: "Certified nutritionist specializing in sustainable weight loss through balanced eating. I believe in building habits that last, not quick fixes.",
    clientCount: 47,
    maxClients: 50,
    rating: 4.9,
    reviewCount: 38,
    pricePerMonth: 199,
    location: "Los Angeles, CA",
    responseTime: "< 2 hours",
    verified: true,
    yearsExperience: 8,
    certifications: ["CNS", "NASM"],
  },
  {
    id: "2",
    firstName: "David",
    lastName: "Chen",
    imageUrl: null,
    specialty: "Sports Nutrition",
    secondarySpecialties: ["Performance", "Muscle Building"],
    bio: "Former collegiate athlete turned nutrition coach. I help athletes and fitness enthusiasts optimize their nutrition for peak performance.",
    clientCount: 32,
    maxClients: 40,
    rating: 4.8,
    reviewCount: 29,
    pricePerMonth: 249,
    location: "Austin, TX",
    responseTime: "< 4 hours",
    verified: true,
    yearsExperience: 6,
    certifications: ["CISSN", "CSCS"],
  },
  {
    id: "3",
    firstName: "Sarah",
    lastName: "Thompson",
    imageUrl: null,
    specialty: "Holistic Nutrition",
    secondarySpecialties: ["Gut Health", "Anti-Inflammatory"],
    bio: "Integrative nutrition specialist focused on whole-body wellness. I combine traditional nutrition science with holistic practices.",
    clientCount: 28,
    maxClients: 35,
    rating: 5.0,
    reviewCount: 24,
    pricePerMonth: 279,
    location: "Denver, CO",
    responseTime: "< 1 hour",
    verified: true,
    yearsExperience: 10,
    certifications: ["MS, RDN", "IFNCP"],
  },
  {
    id: "4",
    firstName: "Marcus",
    lastName: "Johnson",
    imageUrl: null,
    specialty: "Plant-Based",
    secondarySpecialties: ["Vegan Athletes", "Meal Prep"],
    bio: "Plant-powered nutrition coach helping clients thrive on vegan and vegetarian diets. Proof that plants build muscle!",
    clientCount: 41,
    maxClients: 45,
    rating: 4.7,
    reviewCount: 33,
    pricePerMonth: 179,
    location: "Portland, OR",
    responseTime: "< 3 hours",
    verified: true,
    yearsExperience: 5,
    certifications: ["CNS", "Plant-Based Cert"],
  },
  {
    id: "5",
    firstName: "Emily",
    lastName: "Rodriguez",
    imageUrl: null,
    specialty: "Women's Health",
    secondarySpecialties: ["Hormonal Balance", "Prenatal"],
    bio: "Specialized in women's nutrition through all life stages. From PCOS management to prenatal nutrition, I've got you covered.",
    clientCount: 38,
    maxClients: 40,
    rating: 4.9,
    reviewCount: 41,
    pricePerMonth: 229,
    location: "Miami, FL",
    responseTime: "< 2 hours",
    verified: true,
    yearsExperience: 7,
    certifications: ["RDN", "Women's Health Spec"],
  },
  {
    id: "6",
    firstName: "James",
    lastName: "Park",
    imageUrl: null,
    specialty: "Diabetes Management",
    secondarySpecialties: ["Blood Sugar", "Medical Nutrition"],
    bio: "Registered dietitian specializing in diabetes prevention and management. Evidence-based approach to metabolic health.",
    clientCount: 25,
    maxClients: 30,
    rating: 4.8,
    reviewCount: 22,
    pricePerMonth: 259,
    location: "Seattle, WA",
    responseTime: "< 4 hours",
    verified: true,
    yearsExperience: 12,
    certifications: ["RDN", "CDE", "CDCES"],
  },
];

const specialties = [
  "All Specialties",
  "Weight Loss",
  "Sports Nutrition",
  "Holistic Nutrition",
  "Plant-Based",
  "Women's Health",
  "Diabetes Management",
  "Gut Health",
  "Muscle Building",
];

const defaultPriceRange = { label: "All Prices", min: 0, max: Infinity };

const priceRanges = [
  defaultPriceRange,
  { label: "Under $200/mo", min: 0, max: 199 },
  { label: "$200 - $250/mo", min: 200, max: 250 },
  { label: "$250+/mo", min: 250, max: Infinity },
];

export default function MarketplacePage(): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [selectedPriceRange, setSelectedPriceRange] = useState(defaultPriceRange);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"rating" | "price" | "clients">("rating");

  // Filter coaches
  const filteredCoaches = demoCoaches
    .filter((coach) => {
      const matchesSearch =
        searchQuery === "" ||
        `${coach.firstName} ${coach.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coach.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coach.secondarySpecialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSpecialty =
        selectedSpecialty === "All Specialties" ||
        coach.specialty === selectedSpecialty ||
        coach.secondarySpecialties.includes(selectedSpecialty);

      const matchesPrice =
        coach.pricePerMonth >= selectedPriceRange.min &&
        coach.pricePerMonth <= selectedPriceRange.max;

      return matchesSearch && matchesSpecialty && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price") return a.pricePerMonth - b.pricePerMonth;
      if (sortBy === "clients") return b.clientCount - a.clientCount;
      return 0;
    });

  return (
    <div className="min-h-screen bg-nooch-light/30">
      {/* Header */}
      <div className="border-b border-nooch-light bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-coral-400 to-orange-400">
                <span className="text-lg font-extrabold text-white">n</span>
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-nooch-dark">
                nooch
              </span>
            </Link>
            <span className="text-nooch-gray">/</span>
            <span className="font-semibold text-nooch-dark">Marketplace</span>
          </div>

          <div className="mt-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-nooch-dark sm:text-4xl">
              Find Your Perfect Coach
            </h1>
            <p className="mt-2 text-lg text-nooch-gray">
              Browse verified nutrition coaches ready to help you transform your health
            </p>
            <p className="mt-1 font-mono text-sm text-coral-500">
              $ nooch discover --verified --experts
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-nooch-gray" />
              <input
                type="text"
                placeholder="Search by name, specialty, or focus area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-nooch-light bg-white py-3 pl-12 pr-4 text-nooch-dark placeholder:text-nooch-gray/60 focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-400/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-nooch-gray hover:text-nooch-dark"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-xl border border-nooch-light bg-white px-4 py-3 font-medium text-nooch-dark transition-colors hover:border-coral-400 lg:hidden"
            >
              <Filter className="h-5 w-5" />
              Filters
              {(selectedSpecialty !== "All Specialties" || selectedPriceRange.label !== "All Prices") && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-coral-400 text-xs text-white">
                  {(selectedSpecialty !== "All Specialties" ? 1 : 0) + (selectedPriceRange.label !== "All Prices" ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Desktop Filters */}
            <div className="hidden items-center gap-3 lg:flex">
              {/* Specialty Filter */}
              <div className="relative">
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="appearance-none rounded-xl border border-nooch-light bg-white py-3 pl-4 pr-10 font-medium text-nooch-dark focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-400/20"
                >
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-nooch-gray" />
              </div>

              {/* Price Filter */}
              <div className="relative">
                <select
                  value={selectedPriceRange.label}
                  onChange={(e) => {
                    const range = priceRanges.find((r) => r.label === e.target.value);
                    if (range) setSelectedPriceRange(range);
                  }}
                  className="appearance-none rounded-xl border border-nooch-light bg-white py-3 pl-4 pr-10 font-medium text-nooch-dark focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-400/20"
                >
                  {priceRanges.map((range) => (
                    <option key={range.label} value={range.label}>
                      {range.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-nooch-gray" />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="appearance-none rounded-xl border border-nooch-light bg-white py-3 pl-4 pr-10 font-medium text-nooch-dark focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-400/20"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="price">Lowest Price</option>
                  <option value="clients">Most Clients</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-nooch-gray" />
              </div>
            </div>
          </div>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <div className="mt-4 rounded-xl border border-nooch-light bg-white p-4 lg:hidden">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-nooch-dark">
                    Specialty
                  </label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full rounded-lg border border-nooch-light bg-white p-2.5 text-nooch-dark"
                  >
                    {specialties.map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-nooch-dark">
                    Price Range
                  </label>
                  <select
                    value={selectedPriceRange.label}
                    onChange={(e) => {
                      const range = priceRanges.find((r) => r.label === e.target.value);
                      if (range) setSelectedPriceRange(range);
                    }}
                    className="w-full rounded-lg border border-nooch-light bg-white p-2.5 text-nooch-dark"
                  >
                    {priceRanges.map((range) => (
                      <option key={range.label} value={range.label}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-nooch-dark">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="w-full rounded-lg border border-nooch-light bg-white p-2.5 text-nooch-dark"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="price">Lowest Price</option>
                    <option value="clients">Most Clients</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-nooch-gray">
            <span className="font-semibold text-nooch-dark">{filteredCoaches.length}</span> coaches found
          </p>
          <div className="flex items-center gap-2 text-sm text-nooch-gray">
            <Shield className="h-4 w-4 text-coral-400" />
            <span>All coaches verified</span>
          </div>
        </div>

        {/* Coach Grid */}
        {filteredCoaches.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCoaches.map((coach) => (
              <CoachCard key={coach.id} coach={coach} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-nooch-light bg-white p-12 text-center">
            <Search className="mx-auto h-12 w-12 text-nooch-gray/40" />
            <h3 className="mt-4 text-lg font-semibold text-nooch-dark">
              No coaches found
            </h3>
            <p className="mt-2 text-nooch-gray">
              Try adjusting your filters or search query
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedSpecialty("All Specialties");
                setSelectedPriceRange(defaultPriceRange);
              }}
              className="mt-4 text-coral-500 hover:text-coral-600"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 rounded-2xl bg-gradient-to-br from-coral-400 to-orange-400 p-8 text-center text-white md:p-12">
          <Sparkles className="mx-auto h-10 w-10" />
          <h2 className="mt-4 text-2xl font-extrabold md:text-3xl">
            Are you a nutrition coach?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-white/90">
            Join our marketplace and scale your practice with AI-powered tools.
            Serve 3x more clients while maintaining your personal touch.
          </p>
          <Link
            href="/sign-up"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-coral-500 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Apply to join
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function CoachCard({ coach }: { coach: typeof demoCoaches[0] }) {
  const availability = coach.maxClients - coach.clientCount;
  const availabilityPercent = (coach.clientCount / coach.maxClients) * 100;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-nooch-light bg-white transition-all duration-300 hover:border-coral-200 hover:shadow-lg">
      {/* Verified Badge */}
      {coach.verified && (
        <div className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
          <CheckCircle2 className="h-3 w-3" />
          Verified
        </div>
      )}

      <div className="p-6">
        {/* Profile Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-coral-200 to-coral-300 text-xl font-bold text-coral-700">
            {coach.firstName[0]}{coach.lastName[0]}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-nooch-dark">
              {coach.firstName} {coach.lastName}
            </h3>
            <p className="text-sm font-medium text-coral-500">{coach.specialty}</p>
            <div className="mt-1 flex items-center gap-2 text-sm text-nooch-gray">
              <MapPin className="h-3.5 w-3.5" />
              {coach.location}
            </div>
          </div>
        </div>

        {/* Rating & Reviews */}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-nooch-dark">{coach.rating}</span>
          </div>
          <span className="text-sm text-nooch-gray">
            {coach.reviewCount} verified reviews
          </span>
        </div>

        {/* Bio */}
        <p className="mt-4 line-clamp-2 text-sm text-nooch-gray">
          {coach.bio}
        </p>

        {/* Specialties */}
        <div className="mt-4 flex flex-wrap gap-2">
          {coach.secondarySpecialties.map((specialty) => (
            <span
              key={specialty}
              className="rounded-full bg-coral-50 px-2.5 py-1 text-xs font-medium text-coral-600"
            >
              {specialty}
            </span>
          ))}
        </div>

        {/* Certifications */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-nooch-gray">Certifications:</span>
          <span className="text-xs font-medium text-nooch-dark">
            {coach.certifications.join(", ")}
          </span>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-nooch-light pt-4">
          <div>
            <div className="flex items-center gap-1.5 text-sm text-nooch-gray">
              <Users className="h-4 w-4" />
              <span>{coach.clientCount} clients</span>
            </div>
            <div className="mt-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-nooch-light">
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
                {availability > 0 ? (
                  <span className="text-emerald-600">{availability} spots open</span>
                ) : (
                  <span className="text-red-500">Waitlist only</span>
                )}
              </p>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-sm text-nooch-gray">
              <Clock className="h-4 w-4" />
              <span>Response: {coach.responseTime}</span>
            </div>
            <p className="mt-1 text-xs text-nooch-gray">
              {coach.yearsExperience} years experience
            </p>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="mt-4 flex items-center justify-between border-t border-nooch-light pt-4">
          <div>
            <span className="text-2xl font-bold text-nooch-dark">
              ${coach.pricePerMonth}
            </span>
            <span className="text-nooch-gray">/month</span>
          </div>
          <Link
            href={`/marketplace/${coach.id}`}
            className="rounded-xl bg-coral-400 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-coral-500"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
