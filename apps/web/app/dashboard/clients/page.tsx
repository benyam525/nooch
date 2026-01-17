import { ClientTable } from "@/components/clients/ClientTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Demo client data
const demoClients = [
  {
    id: "1",
    goals: "Lose 20 lbs and build healthy eating habits",
    onboardingComplete: true,
    riskScore: 78,
    user: {
      id: "u1",
      email: "sarah@example.com",
      firstName: "Sarah",
      lastName: "Johnson",
      imageUrl: null,
    },
    _count: { progressLogs: 24, conversations: 5 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
  },
  {
    id: "2",
    goals: "Build muscle mass with clean eating",
    onboardingComplete: true,
    riskScore: 35,
    user: {
      id: "u2",
      email: "mike@example.com",
      firstName: "Mike",
      lastName: "Chen",
      imageUrl: null,
    },
    _count: { progressLogs: 18, conversations: 3 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
  },
  {
    id: "3",
    goals: null,
    onboardingComplete: false,
    riskScore: null,
    user: {
      id: "u3",
      email: "emma@example.com",
      firstName: "Emma",
      lastName: "Wilson",
      imageUrl: null,
    },
    _count: { progressLogs: 0, conversations: 1 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
];

export default function ClientsPage(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-nooch-dark">
            Clients
          </h1>
          <p className="mt-1 font-mono text-sm text-nooch-gray">
            <span className="text-coral-400">$</span> nooch clients --list --progress
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Invite Client
        </Button>
      </div>

      <ClientTable clients={demoClients} />
    </div>
  );
}
