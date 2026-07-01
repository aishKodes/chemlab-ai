"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthProvider";

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const { logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      icon={<LogOut className="h-4 w-4" aria-hidden="true" />}
    >
      {compact ? "Logout" : "Log out"}
    </Button>
  );
}
