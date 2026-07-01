"use client";

import { AdminEntityManager } from "@/components/admin/AdminEntityManager";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { adminApi } from "@/lib/api/adminApi";
import type { BackendSiteSetting } from "@/lib/api/backendTypes";

export default function AdminSettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin / Settings"
        title="Site settings."
        description="Update public switches, display values, and private configuration references."
      />
      <Container className="pb-16">
        <AdminEntityManager<BackendSiteSetting & Record<string, unknown>>
          title="Settings"
          description="Use setting_json for structured values. Keep secrets in Hostinger environment values, not public settings."
          listKey="settings"
          fetchItems={adminApi.getSettings}
          getItemId={(setting) => setting.setting_key}
          updateItem={(id, payload) => {
            return adminApi.updateSetting(String(id), payload);
          }}
          columns={[
            { key: "id", label: "ID" },
            { key: "setting_key", label: "Key" },
            { key: "setting_value", label: "Value" },
            { key: "type", label: "Type" },
            { key: "is_public", label: "Public" },
          ]}
          fields={[
            { name: "setting_key", label: "Setting key", required: true },
            { name: "setting_value", label: "Setting value", type: "textarea" },
            { name: "setting_json", label: "Setting JSON", type: "json" },
            { name: "type", label: "Type", type: "select", options: ["string", "number", "boolean", "json", "image", "secret_ref"].map((value) => ({ label: value, value })) },
            { name: "is_public", label: "Public", type: "select", options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }] },
          ]}
        />
      </Container>
    </>
  );
}
