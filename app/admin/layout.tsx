"use client";

import type { ReactNode } from "react";
import { AdminLayoutFrame } from "@/components/admin/AdminLayoutFrame";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminLayoutFrame>{children}</AdminLayoutFrame>;
}
