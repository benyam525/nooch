import { prisma } from "@nooch/db";

interface RiskFactors {
  missedCheckins: number;
  decliningCompliance: boolean;
  complianceTrend: "improving" | "stable" | "declining" | "unknown";
  avgComplianceScore: number;
  weightTrend: "toward_goal" | "stable" | "away_from_goal" | "unknown";
  daysSinceLastMessage: number;
  daysSinceLastPhoto: number;
  daysSinceLastCheckin: number;
}

interface RiskBreakdown {
  missedCheckinScore: number;
  complianceTrendScore: number;
  weightTrajectoryScore: number;
  messageEngagementScore: number;
  photoEngagementScore: number;
  totalScore: number;
}

/**
 * Calculate risk score for a client
 * Score ranges from 0-100, higher = more at risk
 *
 * Factors (weighted):
 * - Missed check-ins: 25% (max 25 points)
 * - Compliance trend: 25% (max 25 points)
 * - Weight trajectory: 20% (max 20 points)
 * - Message engagement: 15% (max 15 points)
 * - Photo uploads: 15% (max 15 points)
 */
export async function calculateRiskScore(clientProfileId: string): Promise<{
  score: number;
  factors: RiskFactors;
  breakdown: RiskBreakdown;
}> {
  const now = new Date();
  const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const threeWeeksAgo = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000);

  // Fetch client data
  const client = await prisma.clientProfile.findUnique({
    where: { id: clientProfileId },
    include: {
      weeklyCheckins: {
        orderBy: { weekStartDate: "desc" },
        take: 8, // Last 8 weeks
      },
      progressPhotos: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      conversations: {
        include: {
          messages: {
            where: { senderId: { not: null } }, // Only user messages
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
    },
  });

  if (!client) {
    throw new Error("Client not found");
  }

  // Initialize factors
  const factors: RiskFactors = {
    missedCheckins: 0,
    decliningCompliance: false,
    complianceTrend: "unknown",
    avgComplianceScore: 0,
    weightTrend: "unknown",
    daysSinceLastMessage: 999,
    daysSinceLastPhoto: 999,
    daysSinceLastCheckin: 999,
  };

  // Calculate missed check-ins (should have 1 per week for last 4 weeks)
  const recentCheckins = client.weeklyCheckins.filter(
    (c) => c.weekStartDate >= fourWeeksAgo
  );
  factors.missedCheckins = Math.max(0, 4 - recentCheckins.length);

  // Calculate compliance trend
  if (client.weeklyCheckins.length >= 3) {
    const scores = client.weeklyCheckins.slice(0, 4).map((c) => c.complianceScore);
    factors.avgComplianceScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    // Check trend direction
    if (scores.length >= 3) {
      const recent = scores.slice(0, 2).reduce((a, b) => a + b, 0) / 2;
      const older = scores.slice(2, 4).reduce((a, b) => a + b, 0) / Math.min(2, scores.length - 2);

      if (recent < older - 1) {
        factors.complianceTrend = "declining";
        factors.decliningCompliance = true;
      } else if (recent > older + 1) {
        factors.complianceTrend = "improving";
      } else {
        factors.complianceTrend = "stable";
      }
    }
  }

  // Calculate weight trend (if target weight is set)
  if (client.targetWeight && client.weeklyCheckins.length >= 2) {
    const recentWeight = client.weeklyCheckins[0]?.currentWeight;
    const olderWeight = client.weeklyCheckins[1]?.currentWeight;

    if (recentWeight && olderWeight) {
      const targetDiff = Math.abs(client.targetWeight - recentWeight);
      const oldTargetDiff = Math.abs(client.targetWeight - olderWeight);

      if (targetDiff < oldTargetDiff - 0.5) {
        factors.weightTrend = "toward_goal";
      } else if (targetDiff > oldTargetDiff + 0.5) {
        factors.weightTrend = "away_from_goal";
      } else {
        factors.weightTrend = "stable";
      }
    }
  }

  // Calculate days since last message
  const lastMessage = client.conversations
    .flatMap((c) => c.messages)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

  if (lastMessage) {
    factors.daysSinceLastMessage = Math.floor(
      (now.getTime() - lastMessage.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  // Calculate days since last photo
  if (client.progressPhotos.length > 0) {
    factors.daysSinceLastPhoto = Math.floor(
      (now.getTime() - client.progressPhotos[0].createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  // Calculate days since last check-in
  if (client.weeklyCheckins.length > 0) {
    factors.daysSinceLastCheckin = Math.floor(
      (now.getTime() - client.weeklyCheckins[0].weekStartDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  // Calculate breakdown scores
  const breakdown: RiskBreakdown = {
    // Missed check-ins: +6.25 per missed week (max 25)
    missedCheckinScore: Math.min(25, factors.missedCheckins * 6.25),

    // Compliance trend: 0 if improving, 10 if stable with low score, 25 if declining
    complianceTrendScore:
      factors.complianceTrend === "declining"
        ? 25
        : factors.complianceTrend === "stable" && factors.avgComplianceScore < 5
        ? 15
        : factors.complianceTrend === "stable"
        ? 5
        : 0,

    // Weight trajectory: 0 if toward goal, 10 if stable, 20 if away from goal
    weightTrajectoryScore:
      factors.weightTrend === "away_from_goal"
        ? 20
        : factors.weightTrend === "stable"
        ? 5
        : factors.weightTrend === "unknown"
        ? 10
        : 0,

    // Message engagement: +7.5 per week without message (max 15)
    messageEngagementScore: Math.min(
      15,
      Math.floor(factors.daysSinceLastMessage / 7) * 7.5
    ),

    // Photo engagement: +5 per week without photo (max 15)
    photoEngagementScore: Math.min(
      15,
      Math.floor(factors.daysSinceLastPhoto / 7) * 5
    ),

    totalScore: 0,
  };

  // Calculate total score
  breakdown.totalScore = Math.min(
    100,
    breakdown.missedCheckinScore +
      breakdown.complianceTrendScore +
      breakdown.weightTrajectoryScore +
      breakdown.messageEngagementScore +
      breakdown.photoEngagementScore
  );

  return {
    score: Math.round(breakdown.totalScore),
    factors,
    breakdown,
  };
}

/**
 * Update risk scores for all clients of a coach
 */
export async function updateAllClientRiskScores(coachId: string): Promise<void> {
  const clients = await prisma.clientProfile.findMany({
    where: { coachId },
    select: { id: true },
  });

  for (const client of clients) {
    try {
      const { score, factors } = await calculateRiskScore(client.id);

      await prisma.clientProfile.update({
        where: { id: client.id },
        data: {
          riskScore: score,
          riskFactors: factors as any,
          lastRiskUpdate: new Date(),
        },
      });
    } catch (error) {
      console.error(`Failed to update risk score for client ${client.id}:`, error);
    }
  }
}

/**
 * Get risk level from score
 */
export function getRiskLevel(score: number): {
  level: "low" | "moderate" | "high" | "critical";
  label: string;
  color: string;
} {
  if (score <= 25) {
    return { level: "low", label: "On Track", color: "green" };
  } else if (score <= 50) {
    return { level: "moderate", label: "Needs Attention", color: "yellow" };
  } else if (score <= 75) {
    return { level: "high", label: "Intervention Recommended", color: "orange" };
  } else {
    return { level: "critical", label: "Immediate Outreach Needed", color: "red" };
  }
}
