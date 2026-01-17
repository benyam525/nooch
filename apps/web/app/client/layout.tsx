"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardCheck,
  Camera,
  User,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/client", icon: LayoutDashboard },
  { name: "Weekly Check-in", href: "/client/checkin", icon: ClipboardCheck },
  { name: "Photos", href: "/client/photos", icon: Camera },
  { name: "Profile", href: "/client/profile", icon: User },
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/client" className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-nooch-dark">
                nooch
              </span>
            </Link>
            <nav className="hidden gap-1 md:flex">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/client" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-coral-400 text-white"
                        : "text-nooch-gray hover:bg-coral-50 hover:text-coral-500"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-nooch-gray hover:bg-red-50 hover:text-red-500">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white md:hidden">
        <div className="flex justify-around">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/client" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium",
                  isActive
                    ? "text-coral-500"
                    : "text-nooch-gray"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-6 pb-24 md:pb-6">{children}</main>
    </div>
  );
}
