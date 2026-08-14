"use client";

import { Atom, FlaskConical, LayoutDashboard, LogIn, Menu, MessageSquareText, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { useAuth } from "@/components/auth/AuthProvider";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { dashboardPathForRole } from "@/lib/auth/authTypes";

const navigation = [
  { href: "/showcase", label: "Showcase" },
  { href: "/learn", label: "Learn" },
  { href: "/classes", label: "Classes" },
  { href: "/resources", label: "Resources" },
  { href: "/memory-cards", label: "Cards" },
  { href: "/quick-drills", label: "Drills" },
  { href: "/public-quizzes", label: "Battles" },
  { href: "/simulations", label: "Simulations" },
  { href: "/labs", label: "Labs" },
  { href: "/quiz", label: "Quiz" },
];

export function SiteHeader() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const dashboardHref = dashboardPathForRole(user?.role);

  return (
    <header className="sticky top-0 z-50 border-b border-blue-100/70 bg-white/78 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-lg" onClick={() => setMobileOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-2xl border-2 border-white bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-md">
            <Atom className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-base font-black text-slate-950">chemlearning</span>
            <span className="hidden text-xs font-bold text-blue-600 sm:block">Colourful chemistry universe</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 2xl:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring rounded-2xl px-3 py-2 text-sm font-extrabold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 2xl:flex">
          <Button
            href="/ai-tutor"
            variant="secondary"
            size="sm"
            icon={<MessageSquareText className="h-4 w-4" aria-hidden="true" />}
          >
            Chem-Shastri
          </Button>
          <Button
            href="/labs"
            size="sm"
            icon={<FlaskConical className="h-4 w-4" aria-hidden="true" />}
          >
            Enter Lab
          </Button>
          {!isLoading && isAuthenticated && user ? (
            <>
              <NotificationBell />
              <Button href={dashboardHref} variant="secondary" size="sm" icon={<LayoutDashboard className="h-4 w-4" aria-hidden="true" />}>
                {user.role === "admin" ? "Admin" : user.role === "teacher" ? "Teacher" : "Dashboard"}
              </Button>
              <LogoutButton compact />
            </>
          ) : !isLoading ? (
            <>
              <Button href="/login" variant="ghost" size="sm" icon={<LogIn className="h-4 w-4" aria-hidden="true" />}>
                Login
              </Button>
              <Button href="/signup" size="sm" icon={<UserPlus className="h-4 w-4" aria-hidden="true" />}>
                Sign up
              </Button>
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-2 2xl:hidden">
          {isAuthenticated ? <NotificationBell /> : null}
          <Link
            href={isAuthenticated ? dashboardHref : "/login"}
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-100 bg-white/80 text-blue-700 shadow-sm transition hover:bg-blue-50"
            aria-label={isAuthenticated ? "Open dashboard" : "Open login"}
          >
            {isAuthenticated ? <LayoutDashboard className="h-5 w-5" aria-hidden="true" /> : <LogIn className="h-5 w-5" aria-hidden="true" />}
          </Link>
          <button
            type="button"
            className="focus-ring grid h-10 w-10 place-items-center rounded-2xl border border-blue-100 bg-white/80 text-slate-700 shadow-sm"
            aria-label="Toggle navigation"
            onClick={() => setMobileOpen((current) => !current)}
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </Container>

      {mobileOpen ? (
        <div className="border-t border-blue-100 bg-white/95 px-4 py-4 shadow-xl 2xl:hidden">
          <nav aria-label="Mobile primary" className="grid gap-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring rounded-2xl px-4 py-3 text-sm font-black text-slate-700 hover:bg-blue-50"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/ai-tutor"
              className="focus-ring rounded-2xl px-4 py-3 text-sm font-black text-blue-700 hover:bg-blue-50"
              onClick={() => setMobileOpen(false)}
            >
              Ask Chem-Shastri
            </Link>
            {isAuthenticated && user ? (
              <>
                <Link
                  href={dashboardHref}
                  className="focus-ring rounded-2xl px-4 py-3 text-sm font-black text-blue-700 hover:bg-blue-50"
                  onClick={() => setMobileOpen(false)}
                >
                  {user.role === "admin" ? "Admin" : user.role === "teacher" ? "Teacher Dashboard" : "Student Dashboard"}
                </Link>
                <div className="px-1">
                  <LogoutButton compact />
                </div>
              </>
            ) : (
              <div className="grid gap-2 px-1 pt-2 sm:grid-cols-2">
                <Button href="/login" variant="secondary" size="sm">
                  Login
                </Button>
                <Button href="/signup" size="sm">
                  Sign up
                </Button>
              </div>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
