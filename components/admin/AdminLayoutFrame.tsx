"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  BookOpen,
  BrainCircuit,
  Boxes,
  FileText,
  Image as ImageIcon,
  Layers3,
  Mail,
  Map,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/resources/structure", label: "Class Structure", icon: Layers3 },
  { href: "/admin/resources", label: "Resources", icon: BookOpen },
  { href: "/admin/open-resources", label: "Open Resources", icon: BookOpen },
  { href: "/admin/content-factory", label: "Content Factory", icon: Sparkles },
  { href: "/admin/roadmap", label: "Roadmap", icon: Map },
  { href: "/admin/memory-cards", label: "Memory Cards", icon: Boxes },
  { href: "/admin/quick-drills", label: "Quick Drills", icon: Sparkles },
  { href: "/admin/concept-maps", label: "Concept Maps", icon: Map },
  { href: "/admin/mistake-patterns", label: "Mistakes", icon: Bell },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/email", label: "Email", icon: Mail },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/chem-shastri", label: "Chem-Shastri", icon: BrainCircuit },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminLayoutFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <RoleGuard allowed={["admin"]}>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dff7ff,transparent_35%),linear-gradient(135deg,#fffdf7,#eef7ff_45%,#f5efff)]">
        <div className="mx-auto flex w-full max-w-[96rem] gap-4 px-3 py-4 sm:px-5">
          <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-72 shrink-0 overflow-y-auto rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-xl shadow-blue-100/50 backdrop-blur-xl xl:block">
            <Link href="/admin" className="flex items-center gap-3 rounded-3xl bg-blue-600 p-3 text-white">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/20 font-black">C</span>
              <span>
                <span className="block text-sm font-black">Chemlab Admin</span>
                <span className="block text-xs font-bold text-blue-100">Resource control room</span>
              </span>
            </Link>
            <nav className="mt-5 space-y-1" aria-label="Admin navigation">
              {links.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-black transition",
                      active ? "bg-blue-100 text-blue-900" : "text-slate-600 hover:bg-white hover:text-blue-800",
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-5 border-t border-slate-200 pt-4">
              <LogoutButton />
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            <div className="mb-4 flex gap-2 overflow-x-auto rounded-3xl border border-white/70 bg-white/80 p-2 shadow-sm xl:hidden">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "shrink-0 rounded-2xl px-3 py-2 text-xs font-black",
                    pathname === link.href ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-900",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
