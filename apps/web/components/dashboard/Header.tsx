"use client";

import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header(): React.JSX.Element {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="lg:hidden">
        <span className="text-xl font-extrabold tracking-tight text-nooch-dark">
          nooch
        </span>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-nooch-gray hover:bg-coral-50 hover:text-coral-500"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-coral-400 text-[10px] font-medium text-white">
            3
          </span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-nooch-gray hover:bg-coral-50 hover:text-coral-500"
        >
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
