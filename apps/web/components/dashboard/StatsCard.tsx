import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
  highlight?: boolean;
}

export function StatsCard({
  title,
  value,
  icon,
  description,
  highlight,
}: StatsCardProps): React.JSX.Element {
  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-lg",
        highlight && "border-coral-300 bg-coral-50/50"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-nooch-gray">
          {title}
        </CardTitle>
        <div className={cn(highlight ? "text-coral-500" : "text-nooch-gray")}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "text-2xl font-bold",
            highlight ? "text-coral-500" : "text-nooch-dark"
          )}
        >
          {value}
        </div>
        {description && (
          <p className="text-xs text-nooch-gray">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
