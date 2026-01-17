"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CheckCircle,
  FileText,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clients", href: "/dashboard/clients", icon: Users },
  { name: "Approvals", href: "/dashboard/approvals", icon: CheckCircle },
  { name: "Methodology", href: "/dashboard/methodology", icon: FileText },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar(): React.JSX.Element {
  const pathname = usePathname();

  return (
    <div className="hidden w-64 flex-col border-r bg-white lg:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-tight text-nooch-dark">
            nooch
          </span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-coral-400 text-white shadow-sm"
                  : "text-nooch-gray hover:bg-coral-50 hover:text-coral-500"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <p className="font-mono text-xs text-nooch-gray">
          <span className="text-coral-400">$</span> nooch --scale
          <br />
          <span className="text-coral-400">$</span> --keep-touch
        </p>
      </div>
    </div>
  );
}
