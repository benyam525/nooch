import { StatsCard } from "@/components/dashboard/StatsCard";
import { Users, MessageSquare, CheckCircle, FileText } from "lucide-react";
import Link from "next/link";

export default function DashboardPage(): React.JSX.Element {
  // Demo data
  const stats = {
    clients: 12,
    pendingApprovals: 5,
    messages: 156,
    documents: 8,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-nooch-dark">
          Welcome back, Coach!
        </h1>
        <p className="mt-1 font-mono text-sm text-nooch-gray">
          <span className="text-coral-400">$</span> status --clients --today
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Clients"
          value={stats.clients}
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={<CheckCircle className="h-4 w-4" />}
          highlight={stats.pendingApprovals > 0}
        />
        <StatsCard
          title="Total Messages"
          value={stats.messages}
          icon={<MessageSquare className="h-4 w-4" />}
        />
        <StatsCard
          title="Documents"
          value={stats.documents}
          icon={<FileText className="h-4 w-4" />}
        />
      </div>

      {stats.pendingApprovals > 0 && (
        <div className="rounded-2xl border border-coral-200 bg-coral-50 p-5">
          <h3 className="font-semibold text-coral-600">
            You have {stats.pendingApprovals} pending approval
            {stats.pendingApprovals > 1 ? "s" : ""}
          </h3>
          <p className="mt-1 text-sm text-coral-500">
            Review and approve AI-generated responses before they reach your
            clients.
          </p>
          <Link
            href="/dashboard/approvals"
            className="mt-3 inline-block rounded-lg bg-coral-400 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-coral-500 hover:shadow-md"
          >
            Review now
          </Link>
        </div>
      )}
    </div>
  );
}
