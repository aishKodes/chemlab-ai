import { RoleGuard } from "@/components/auth/RoleGuard";
import { StudentAnalyticsDashboard } from "@/components/admin/StudentAnalyticsDashboard";

export default function AdminAnalyticsStudentsPage() {
  return (
    <RoleGuard allowed={["admin"]}>
      <StudentAnalyticsDashboard />
    </RoleGuard>
  );
}
