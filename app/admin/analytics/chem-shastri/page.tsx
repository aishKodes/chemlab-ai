import { RoleGuard } from "@/components/auth/RoleGuard";
import { ChemShastriQuestionAnalytics } from "@/components/admin/ChemShastriQuestionAnalytics";

export default function AdminAnalyticsChemShastriPage() {
  return (
    <RoleGuard allowed={["admin"]}>
      <ChemShastriQuestionAnalytics />
    </RoleGuard>
  );
}
