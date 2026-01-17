"use client";

import Link from "next/link";
import { formatRelativeTime, getInitials } from "@nooch/shared";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskBadge, RiskScoreCircle } from "@/components/clients/RiskBadge";
import {
  AlertTriangle,
  TrendingDown,
  Calendar,
  MessageSquare,
  Camera,
  RefreshCw,
} from "lucide-react";

// Demo data for at-risk clients
const atRiskClients = [
  {
    id: "1",
    user: {
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah@example.com",
      imageUrl: null,
    },
    riskScore: 78,
    riskFactors: {
      missedCheckins: 3,
      decliningCompliance: true,
      complianceTrend: "declining",
      avgComplianceScore: 4.2,
      daysSinceLastMessage: 12,
      daysSinceLastPhoto: 21,
      daysSinceLastCheckin: 18,
    },
    weeklyCheckins: [
      { complianceScore: 4, weekStartDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      { complianceScore: 5, weekStartDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
      { complianceScore: 7, weekStartDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000) },
    ],
  },
  {
    id: "2",
    user: {
      firstName: "Mike",
      lastName: "Chen",
      email: "mike@example.com",
      imageUrl: null,
    },
    riskScore: 52,
    riskFactors: {
      missedCheckins: 2,
      decliningCompliance: false,
      complianceTrend: "stable",
      avgComplianceScore: 5.5,
      daysSinceLastMessage: 8,
      daysSinceLastPhoto: 14,
      daysSinceLastCheckin: 10,
    },
    weeklyCheckins: [
      { complianceScore: 5, weekStartDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      { complianceScore: 6, weekStartDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
    ],
  },
  {
    id: "3",
    user: {
      firstName: "Emma",
      lastName: "Wilson",
      email: "emma@example.com",
      imageUrl: null,
    },
    riskScore: 35,
    riskFactors: {
      missedCheckins: 1,
      decliningCompliance: false,
      complianceTrend: "stable",
      avgComplianceScore: 6.0,
      daysSinceLastMessage: 5,
      daysSinceLastPhoto: 10,
      daysSinceLastCheckin: 5,
    },
    weeklyCheckins: [
      { complianceScore: 6, weekStartDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      { complianceScore: 6, weekStartDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
      { complianceScore: 7, weekStartDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000) },
    ],
  },
];

export default function AtRiskPage(): React.JSX.Element {
  const criticalCount = atRiskClients.filter((c) => c.riskScore > 75).length;
  const highCount = atRiskClients.filter((c) => c.riskScore > 50 && c.riskScore <= 75).length;
  const moderateCount = atRiskClients.filter((c) => c.riskScore >= 25 && c.riskScore <= 50).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-nooch-dark">
            At-Risk Clients
          </h1>
          <p className="mt-1 font-mono text-sm text-nooch-gray">
            <span className="text-coral-400">$</span> nooch risk --scan --alert
          </p>
        </div>
        <Button variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Recalculate All
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-700">{criticalCount}</p>
              <p className="text-sm text-red-600">Critical (76-100)</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
              <TrendingDown className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-700">{highCount}</p>
              <p className="text-sm text-orange-600">High Risk (51-75)</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-700">{moderateCount}</p>
              <p className="text-sm text-yellow-600">Moderate (25-50)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client List */}
      <div className="space-y-4">
        {atRiskClients.map((client) => (
          <Card key={client.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-start gap-6 p-6">
                {/* Risk Score Circle */}
                <RiskScoreCircle score={client.riskScore} size="lg" />

                {/* Client Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link
                        href={`/dashboard/clients/${client.id}`}
                        className="text-lg font-semibold hover:underline"
                      >
                        {client.user.firstName} {client.user.lastName}
                      </Link>
                      <p className="text-sm text-muted-foreground">{client.user.email}</p>
                      <div className="mt-2">
                        <RiskBadge score={client.riskScore} />
                      </div>
                    </div>
                    <Button asChild>
                      <Link href={`/dashboard/clients/${client.id}`}>View Details</Link>
                    </Button>
                  </div>

                  {/* Risk Factors */}
                  <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span className="text-xs">Missed Check-ins</span>
                      </div>
                      <p className="mt-1 text-lg font-semibold">
                        {client.riskFactors.missedCheckins}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <TrendingDown className="h-4 w-4" />
                        <span className="text-xs">Compliance Trend</span>
                      </div>
                      <p className="mt-1 text-lg font-semibold capitalize">
                        {client.riskFactors.complianceTrend}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-xs">Days Since Message</span>
                      </div>
                      <p className="mt-1 text-lg font-semibold">
                        {client.riskFactors.daysSinceLastMessage}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Camera className="h-4 w-4" />
                        <span className="text-xs">Days Since Photo</span>
                      </div>
                      <p className="mt-1 text-lg font-semibold">
                        {client.riskFactors.daysSinceLastPhoto}
                      </p>
                    </div>
                  </div>

                  {/* Compliance History */}
                  {client.weeklyCheckins.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 text-sm font-medium text-muted-foreground">
                        Recent Compliance Scores
                      </p>
                      <div className="flex gap-2">
                        {client.weeklyCheckins.map((checkin, i) => (
                          <div
                            key={i}
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                              checkin.complianceScore >= 7
                                ? "bg-green-100 text-green-700"
                                : checkin.complianceScore >= 5
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {checkin.complianceScore}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {atRiskClients.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <AlertTriangle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">All Clients On Track</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No clients currently need intervention
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
