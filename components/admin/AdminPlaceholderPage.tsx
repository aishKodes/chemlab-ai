import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/layout/PageHeader";

export function AdminPlaceholderPage({
  eyebrow,
  title,
  description,
  icon: Icon,
  nextStage,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  nextStage: string;
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <Container className="pb-16">
        <Card className="bg-gradient-to-br from-white via-blue-50 to-violet-50">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <Badge tone="amber">{nextStage}</Badge>
              <h2 className="mt-4 text-2xl font-black text-slate-950">Foundation ready</h2>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-600">
                This admin area is protected and routed. The next backend stage can add tables, filters, forms, and exports here without changing public labs.
              </p>
              <Button href="/admin" variant="secondary" className="mt-5">
                Back to admin
              </Button>
            </div>
            <div className="grid h-16 w-16 place-items-center rounded-3xl bg-blue-600 text-white shadow-lg">
              <Icon className="h-8 w-8" aria-hidden="true" />
            </div>
          </div>
        </Card>
      </Container>
    </>
  );
}
