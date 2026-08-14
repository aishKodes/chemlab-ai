"use client";

import { useParams } from "next/navigation";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { StudentAnalyticsDetail } from "@/components/admin/StudentAnalyticsDetail";

export default function AdminStudentAnalyticsDetailPage() {
  const params = useParams<{ studentId: string }>();
  return (
    <RoleGuard allowed={["admin"]}>
      <StudentAnalyticsDetail studentId={params.studentId} />
    </RoleGuard>
  );
}
