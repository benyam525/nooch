"use client";

import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  score: number | null | undefined;
  showScore?: boolean;
  size?: "sm" | "md" | "lg";
}

function getRiskLevel(score: number): {
  level: "low" | "moderate" | "high" | "critical";
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
} {
  if (score <= 25) {
    return {
      level: "low",
      label: "On Track",
      color: "green",
      bgColor: "bg-green-100",
      textColor: "text-green-700",
    };
  } else if (score <= 50) {
    return {
      level: "moderate",
      label: "Needs Attention",
      color: "yellow",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-700",
    };
  } else if (score <= 75) {
    return {
      level: "high",
      label: "Intervention Needed",
      color: "orange",
      bgColor: "bg-orange-100",
      textColor: "text-orange-700",
    };
  } else {
    return {
      level: "critical",
      label: "Immediate Outreach",
      color: "red",
      bgColor: "bg-red-100",
      textColor: "text-red-700",
    };
  }
}

export function RiskBadge({
  score,
  showScore = false,
  size = "md",
}: RiskBadgeProps): React.JSX.Element | null {
  if (score === null || score === undefined) {
    return (
      <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500">
        No data
      </span>
    );
  }

  const risk = getRiskLevel(score);

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        risk.bgColor,
        risk.textColor,
        sizeClasses[size]
      )}
    >
      {risk.label}
      {showScore && <span className="opacity-70">({score})</span>}
    </span>
  );
}

export function RiskScoreCircle({
  score,
  size = "md",
}: {
  score: number | null | undefined;
  size?: "sm" | "md" | "lg";
}): React.JSX.Element {
  if (score === null || score === undefined) {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <span className="text-sm text-gray-400">--</span>
      </div>
    );
  }

  const risk = getRiskLevel(score);

  const sizeClasses = {
    sm: "h-10 w-10 text-sm",
    md: "h-14 w-14 text-lg",
    lg: "h-20 w-20 text-2xl",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-bold",
        risk.bgColor,
        risk.textColor,
        sizeClasses[size]
      )}
    >
      {score}
    </div>
  );
}
