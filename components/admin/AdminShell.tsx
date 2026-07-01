"use client";

import {
  BarChart3,
  Bell,
  BookOpen,
  BrainCircuit,
  Boxes,
  Database,
  Mail,
  MonitorCheck,
  Settings,
  Users,
  Image as ImageIcon,
  Layers3,
  Map,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api/adminApi";
import { getBackendBaseUrl, isBackendConfigured } from "@/lib/api/backendClient";
import { getReadableApiError } from "@/lib/api/apiErrors";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";

const adminSections = [
  { title: "Users", href: "/admin/users", icon: Users, detail: "Students, teachers, and admins" },
  { title: "Class Structure", href: "/admin/resources/structure", icon: Layers3, detail: "Classes, books, chapters, topics" },
  { title: "Resources", href: "/admin/resources", icon: BookOpen, detail: "Learning resource foundation" },
  { title: "Memory Cards", href: "/admin/memory-cards", icon: Boxes, detail: "Decks and recall cards" },
  { title: "Quick Drills", href: "/admin/quick-drills", icon: Sparkles, detail: "Practice sets and questions" },
  { title: "Concept Maps", href: "/admin/concept-maps", icon: Map, detail: "Visual knowledge links" },
  { title: "Content", href: "/admin/content", icon: Database, detail: "Pages and content blocks" },
  { title: "Media", href: "/admin/media", icon: ImageIcon, detail: "Uploads and lab visuals" },
  { title: "Email", href: "/admin/email", icon: Mail, detail: "SMTP tests and templates" },
  { title: "Notifications", href: "/admin/notifications", icon: Bell, detail: "Student and teacher notices" },
  { title: "Chem-Shastri", href: "/admin/chem-shastri", icon: BrainCircuit, detail: "Mentor controls and logs" },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3, detail: "Learning events later" },
  { title: "Settings", href: "/admin/settings", icon: Settings, detail: "Site configuration" },
];

export function AdminShell() {
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsReady, setSettingsReady] = useState(false);

  useEffect(() => {
    adminApi
      .getSettings()
      .then(() => {
        setSettingsReady(true);
        setSettingsError(null);
      })
      .catch((caught) => setSettingsError(getReadableApiError(caught)));
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Backend API" value={isBackendConfigured() ? "Configured" : "Missing"} detail={getBackendBaseUrl() || "NEXT_PUBLIC_BACKEND_URL not set"} icon={<MonitorCheck className="h-5 w-5" aria-hidden="true" />} />
        <StatCard label="Resources" value="Seeded" detail="Redox and Hydrocarbon labs available" icon={<BookOpen className="h-5 w-5" aria-hidden="true" />} />
        <StatCard label="Email" value="SMTP" detail="Test route available in backend" icon={<Mail className="h-5 w-5" aria-hidden="true" />} />
        <StatCard label="Chem-Shastri" value="Named" detail="Frontend mentor surface updated" icon={<BrainCircuit className="h-5 w-5" aria-hidden="true" />} />
      </div>

      <Card className="bg-gradient-to-br from-white via-sky-50 to-violet-50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Badge tone={settingsReady ? "green" : "amber"}>{settingsReady ? "Backend reachable" : "Backend check"}</Badge>
            <h2 className="mt-3 text-2xl font-black text-slate-950">Stage 3 admin control room</h2>
            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
              Manage users, class structure, resources, memory cards, quick drills, content, media, email, notifications, and settings from the Hostinger backend.
            </p>
            {settingsError ? <p className="mt-3 text-sm font-bold text-amber-800">{settingsError}</p> : null}
          </div>
          <Button href="/admin/settings" variant="secondary">
            Open settings
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {adminSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.href} interactive>
              <Icon className="h-6 w-6 text-blue-700" aria-hidden="true" />
              <h3 className="mt-3 text-xl font-black text-slate-950">{section.title}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{section.detail}</p>
              <Button href={section.href} size="sm" variant="secondary" className="mt-5">
                Open
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
