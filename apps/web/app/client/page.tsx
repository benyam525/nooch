"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ClipboardCheck,
  Camera,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  Scale,
  ArrowRight,
} from "lucide-react";

// Demo data
const clientData = {
  firstName: "Sarah",
  currentWeight: 165,
  targetWeight: 145,
  lastCheckin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  checkinDue: true,
  weeklyStreak: 3,
  recentCheckins: [
    { complianceScore: 7, weightChange: -1.5, weekStartDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    { complianceScore: 8, weightChange: -2, weekStartDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
    { complianceScore: 6, weightChange: 0.5, weekStartDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000) },
  ],
  coachName: "Coach Mike",
  coachMessage: "Great progress this week! Keep up the momentum with your meal prep.",
};

export default function ClientDashboardPage(): React.JSX.Element {
  const weightLost = clientData.recentCheckins.reduce((total, c) => total + (c.weightChange || 0), 0);
  const daysUntilCheckin = 7 - Math.floor((Date.now() - clientData.lastCheckin.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-nooch-dark">
          Hey {clientData.firstName}!
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s your progress overview
        </p>
      </div>

      {/* Check-in CTA */}
      {clientData.checkinDue && (
        <Card className="border-coral-200 bg-coral-50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-coral-100">
                <ClipboardCheck className="h-6 w-6 text-coral-500" />
              </div>
              <div>
                <p className="font-semibold text-coral-700">Weekly Check-in Due</p>
                <p className="text-sm text-coral-600">
                  {daysUntilCheckin > 0
                    ? `${daysUntilCheckin} days left to submit`
                    : "Submit your check-in today!"}
                </p>
              </div>
            </div>
            <Button asChild className="bg-coral-500 hover:bg-coral-600">
              <Link href="/client/checkin">
                Check In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Scale className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Weight</p>
              <p className="text-2xl font-bold">{clientData.currentWeight} lbs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Goal Weight</p>
              <p className="text-2xl font-bold">{clientData.targetWeight} lbs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
              weightLost < 0 ? "bg-green-100" : "bg-orange-100"
            }`}>
              {weightLost < 0 ? (
                <TrendingDown className="h-6 w-6 text-green-600" />
              ) : (
                <TrendingUp className="h-6 w-6 text-orange-600" />
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last 3 Weeks</p>
              <p className={`text-2xl font-bold ${weightLost < 0 ? "text-green-600" : "text-orange-600"}`}>
                {weightLost < 0 ? "" : "+"}{weightLost.toFixed(1)} lbs
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress to Goal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Progress to Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Starting: 185 lbs</span>
              <span>Goal: {clientData.targetWeight} lbs</span>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-coral-400 to-coral-500"
                style={{
                  width: `${Math.min(100, ((185 - clientData.currentWeight) / (185 - clientData.targetWeight)) * 100)}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{185 - clientData.currentWeight} lbs lost</span>
              <span>{clientData.currentWeight - clientData.targetWeight} lbs to go</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Check-ins */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Check-ins</CardTitle>
          <Link href="/client/checkin" className="text-sm text-coral-500 hover:underline">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {clientData.recentCheckins.map((checkin, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                      checkin.complianceScore >= 7
                        ? "bg-green-100 text-green-700"
                        : checkin.complianceScore >= 5
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {checkin.complianceScore}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Week of {checkin.weekStartDate.toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Compliance score: {checkin.complianceScore}/10
                    </p>
                  </div>
                </div>
                <span
                  className={`text-sm font-medium ${
                    checkin.weightChange < 0
                      ? "text-green-600"
                      : checkin.weightChange > 0
                      ? "text-red-600"
                      : "text-muted-foreground"
                  }`}
                >
                  {checkin.weightChange < 0 ? "" : "+"}{checkin.weightChange} lbs
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Coach Message */}
      {clientData.coachMessage && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-blue-700">
              Message from {clientData.coachName}
            </p>
            <p className="mt-1 text-blue-600">{clientData.coachMessage}</p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Button asChild variant="outline" className="h-auto py-4">
          <Link href="/client/photos" className="flex items-center gap-3">
            <Camera className="h-5 w-5" />
            <span>Upload Progress Photo</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4">
          <Link href="/client/profile" className="flex items-center gap-3">
            <Calendar className="h-5 w-5" />
            <span>Update Health Profile</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
