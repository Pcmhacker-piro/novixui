import React from "react";
import { Link } from "@tanstack/react-router";
import { LogOut, Trophy, Sparkles, BookOpen, Layers, UserCheck } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Avatar } from "@/nova/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/nova/ui/dropdown-menu";
import { Badge } from "@/nova/ui/badge";

export function UserMenu() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="nova-focus-ring relative flex items-center gap-2 rounded-full p-0.5 outline-none transition-transform hover:scale-105">
        <Avatar
          src={user.avatar}
          name={user.name}
          size="sm"
          shape="circle"
          ring="accent"
          status="online"
          className="size-8 cursor-pointer"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60 rounded-xl p-2 shadow-2xl">
        {/* User Identity Header */}
        <div className="flex items-center gap-3 px-2 py-2.5">
          <Avatar
            src={user.avatar}
            name={user.name}
            size="md"
            shape="circle"
            ring="subtle"
            className="size-10"
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-xs font-semibold text-foreground">
                {user.name}
              </span>
              <UserCheck className="size-3 text-accent" />
            </div>
            <span className="truncate text-[11px] text-muted-foreground">
              {user.email}
            </span>
            <div className="mt-1 flex items-center gap-1.5">
              <Badge
                variant="outline"
                size="sm"
                className="h-4 border-emerald-500/30 bg-emerald-500/10 px-1 text-[9px] font-mono text-emerald-400"
              >
                Community {user.role === "creator" ? "Creator" : "Member"}
              </Badge>
              {user.reputation && (
                <span className="text-[10px] text-muted-foreground font-mono">
                  {user.reputation} pts
                </span>
              )}
            </div>
          </div>
        </div>

        <DropdownMenuSeparator className="my-1.5" />

        {/* Navigation actions */}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/challenges" className="flex cursor-pointer items-center gap-2.5 px-2.5 py-2 text-xs">
              <Trophy className="size-4 text-amber-400" />
              <span>Weekly Challenges</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/elements" className="flex cursor-pointer items-center gap-2.5 px-2.5 py-2 text-xs">
              <Layers className="size-4 text-sky-400" />
              <span>Browse Elements</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/docs" className="flex cursor-pointer items-center gap-2.5 px-2.5 py-2 text-xs">
              <BookOpen className="size-4 text-fuchsia-400" />
              <span>Documentation</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1.5" />

        {/* Sign out */}
        <DropdownMenuItem
          onClick={logout}
          className="flex cursor-pointer items-center gap-2.5 px-2.5 py-2 text-xs text-rose-400 focus:bg-rose-500/10 focus:text-rose-400"
        >
          <LogOut className="size-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
