"use client";

import Link from "next/link";
import { formatRelativeTime, getInitials } from "@nooch/shared";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface Client {
  id: string;
  goals: string | null;
  onboardingComplete: boolean;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
  };
  _count: {
    progressLogs: number;
    conversations: number;
  };
  createdAt: Date;
}

interface ClientTableProps {
  clients: Client[];
}

export function ClientTable({ clients }: ClientTableProps): React.JSX.Element {
  return (
    <div className="rounded-lg border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left text-sm font-medium">Client</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Goals</th>
            <th className="px-4 py-3 text-left text-sm font-medium">
              Progress Logs
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Joined</th>
            <th className="px-4 py-3 text-right text-sm font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-b last:border-0">
              <td className="px-4 py-3">
                <Link
                  href={`/clients/${client.id}`}
                  className="flex items-center gap-3 hover:underline"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={client.user.imageUrl || undefined} />
                    <AvatarFallback>
                      {getInitials(
                        client.user.firstName,
                        client.user.lastName
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {client.user.firstName} {client.user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {client.user.email}
                    </p>
                  </div>
                </Link>
              </td>
              <td className="px-4 py-3">
                <p className="max-w-[200px] truncate text-sm text-muted-foreground">
                  {client.goals || "No goals set"}
                </p>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm">{client._count.progressLogs}</span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                    client.onboardingComplete
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {client.onboardingComplete ? "Active" : "Onboarding"}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {formatRelativeTime(client.createdAt)}
              </td>
              <td className="px-4 py-3 text-right">
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
