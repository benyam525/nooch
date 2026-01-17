"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskBadge, RiskScoreCircle } from "@/components/clients/RiskBadge";
import {
  ArrowLeft,
  Calendar,
  MessageSquare,
  Camera,
  TrendingDown,
  TrendingUp,
  Scale,
  Target,
  Activity,
  Edit,
  RefreshCw,
} from "lucide-react";
import { getInitials } from "@nooch/shared";

// Demo data
const demoClient = {
  id: "1",
  user: {
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah@example.com",
    imageUrl: null,
  },
  goals: "Lose 20 lbs and build healthy eating habits",
  currentWeight: 165,
  targetWeight: 145,
  height: 165,
  dateOfBirth: new Date("1990-05-15"),
  activityLevel: "moderate",
  dietaryRestrictions: ["gluten-free", "dairy-free"],
  riskScore: 78,
  riskFactors: {
    missedCheckins: 3,
    decliningCompliance: true,
    complianceTrend: "declining",
    avgComplianceScore: 4.2,
    weightTrend: "away_from_goal",
    daysSinceLastMessage: 12,
    daysSinceLastPhoto: 21,
    daysSinceLastCheckin: 18,
  },
  lastRiskUpdate: new Date(Date.now() - 24 * 60 * 60 * 1000),
  weeklyCheckins: [
    {
      id: "c1",
      complianceScore: 4,
      currentWeight: 167,
      notes: "Had a tough week, lots of stress at work",
      coachNotes: "Discussed stress management strategies",
      coachRating: 5,
      weekStartDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      weightChange: 2,
      complianceTrend: "declining",
    },
    {
      id: "c2",
      complianceScore: 5,
      currentWeight: 165,
      notes: "Better week, stuck to meal prep mostly",
      coachNotes: null,
      coachRating: null,
      weekStartDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      weightChange: -1,
      complianceTrend: "stable",
    },
    {
      id: "c3",
      complianceScore: 7,
      currentWeight: 166,
      notes: "Great week! Followed the plan closely",
      coachNotes: "Excellent progress, keep it up!",
      coachRating: 8,
      weekStartDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      weightChange: -2,
      complianceTrend: "improving",
    },
  ],
  progressPhotos: [
    {
      id: "p1",
      thumbnailUrl: "/placeholder-photo.jpg",
      photoType: "progress",
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    },
    {
      id: "p2",
      thumbnailUrl: "/placeholder-photo.jpg",
      photoType: "meal",
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
  ],
};

export default function ClientDetailPage(): React.JSX.Element {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<"overview" | "checkins" | "photos">("overview");

  // In production, fetch client data using params.id
  const client = demoClient;

  const weightProgress = client.targetWeight && client.currentWeight
    ? Math.round(((client.currentWeight - client.targetWeight) / (client.currentWeight - client.targetWeight + 20)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link
            href="/dashboard/clients"
            className="mt-1 rounded-lg p-2 hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Avatar className="h-16 w-16">
            <AvatarImage src={client.user.imageUrl || undefined} />
            <AvatarFallback className="text-lg">
              {getInitials(client.user.firstName, client.user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              {client.user.firstName} {client.user.lastName}
            </h1>
            <p className="text-sm text-muted-foreground">{client.user.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <RiskBadge score={client.riskScore} showScore />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            Message
          </Button>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex gap-4">
          {(["overview", "checkins", "photos"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-1 py-3 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "border-coral-400 text-coral-500"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === "overview" && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Risk Score Card */}
          <Card className="md:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">Risk Score</CardTitle>
              <Button variant="ghost" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <RiskScoreCircle score={client.riskScore} size="lg" />
                <RiskBadge score={client.riskScore} size="lg" />
                <p className="mt-2 text-xs text-muted-foreground">
                  Last updated: {client.lastRiskUpdate.toLocaleDateString()}
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Missed Check-ins</span>
                  <span className="font-medium">{client.riskFactors.missedCheckins}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Compliance Trend</span>
                  <span className={`font-medium capitalize ${
                    client.riskFactors.complianceTrend === "declining" ? "text-red-600" :
                    client.riskFactors.complianceTrend === "improving" ? "text-green-600" :
                    ""
                  }`}>
                    {client.riskFactors.complianceTrend}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Days Since Message</span>
                  <span className="font-medium">{client.riskFactors.daysSinceLastMessage}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Days Since Photo</span>
                  <span className="font-medium">{client.riskFactors.daysSinceLastPhoto}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Profile Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-medium">Health Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-coral-50">
                      <Scale className="h-5 w-5 text-coral-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Weight</p>
                      <p className="text-lg font-semibold">{client.currentWeight} lbs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                      <Target className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Target Weight</p>
                      <p className="text-lg font-semibold">{client.targetWeight} lbs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                      <Activity className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Activity Level</p>
                      <p className="text-lg font-semibold capitalize">{client.activityLevel}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Goals</p>
                    <p className="mt-1 text-sm">{client.goals || "No goals set"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dietary Restrictions</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {client.dietaryRestrictions.map((restriction) => (
                        <span
                          key={restriction}
                          className="rounded-full bg-muted px-2 py-0.5 text-xs"
                        >
                          {restriction}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weight to Goal</p>
                    <p className="mt-1 text-lg font-semibold">
                      {client.currentWeight - client.targetWeight} lbs to go
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Check-ins */}
          <Card className="md:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-medium">Recent Check-ins</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("checkins")}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {client.weeklyCheckins.slice(0, 3).map((checkin) => (
                  <div
                    key={checkin.id}
                    className="flex items-start gap-4 rounded-lg border p-4"
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold ${
                        checkin.complianceScore >= 7
                          ? "bg-green-100 text-green-700"
                          : checkin.complianceScore >= 5
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {checkin.complianceScore}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          Week of {checkin.weekStartDate.toLocaleDateString()}
                        </p>
                        {checkin.weightChange !== null && (
                          <span
                            className={`flex items-center gap-1 text-xs ${
                              checkin.weightChange < 0
                                ? "text-green-600"
                                : checkin.weightChange > 0
                                ? "text-red-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            {checkin.weightChange < 0 ? (
                              <TrendingDown className="h-3 w-3" />
                            ) : (
                              <TrendingUp className="h-3 w-3" />
                            )}
                            {Math.abs(checkin.weightChange)} lbs
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{checkin.notes}</p>
                      {checkin.coachNotes && (
                        <p className="mt-2 rounded bg-muted/50 p-2 text-sm">
                          <span className="font-medium">Coach notes:</span> {checkin.coachNotes}
                        </p>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {checkin.currentWeight} lbs
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "checkins" && (
        <Card>
          <CardHeader>
            <CardTitle>Check-in History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {client.weeklyCheckins.map((checkin) => (
                <div
                  key={checkin.id}
                  className="flex items-start gap-4 rounded-lg border p-4"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold ${
                      checkin.complianceScore >= 7
                        ? "bg-green-100 text-green-700"
                        : checkin.complianceScore >= 5
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {checkin.complianceScore}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        Week of {checkin.weekStartDate.toLocaleDateString()}
                      </p>
                      {checkin.weightChange !== null && (
                        <span
                          className={`flex items-center gap-1 text-xs ${
                            checkin.weightChange < 0
                              ? "text-green-600"
                              : checkin.weightChange > 0
                              ? "text-red-600"
                              : "text-muted-foreground"
                          }`}
                        >
                          {checkin.weightChange < 0 ? (
                            <TrendingDown className="h-3 w-3" />
                          ) : (
                            <TrendingUp className="h-3 w-3" />
                          )}
                          {Math.abs(checkin.weightChange)} lbs
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{checkin.notes}</p>
                    {checkin.coachNotes && (
                      <p className="mt-2 rounded bg-muted/50 p-2 text-sm">
                        <span className="font-medium">Coach notes:</span> {checkin.coachNotes}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{checkin.currentWeight} lbs</p>
                    {checkin.coachRating && (
                      <p className="text-sm text-muted-foreground">
                        Coach rating: {checkin.coachRating}/10
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "photos" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Progress Photos</h2>
            <Button>
              <Camera className="mr-2 h-4 w-4" />
              Upload Photo
            </Button>
          </div>
          {client.progressPhotos.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {client.progressPhotos.map((photo) => (
                <Card key={photo.id} className="overflow-hidden">
                  <div className="aspect-square bg-muted">
                    <div className="flex h-full items-center justify-center">
                      <Camera className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <p className="text-xs font-medium capitalize">{photo.photoType}</p>
                    <p className="text-xs text-muted-foreground">
                      {photo.createdAt.toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Camera className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-sm text-muted-foreground">No photos uploaded yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
