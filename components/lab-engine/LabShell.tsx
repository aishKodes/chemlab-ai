"use client";

import { LabHUD } from "@/components/lab-engine/LabHUD";
import { LabStage } from "@/components/lab-engine/LabStage";
import type { LabShellProps } from "@/components/lab-engine/labTypes";
import { MasterAlchemLabGuide } from "@/components/lab-engine/MasterAlchemLabGuide";
import { StepActionBar } from "@/components/lab-engine/StepActionBar";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export function LabShell({
  title,
  subtitle,
  phase,
  progress,
  xp,
  badge,
  voltage,
  masterAlchemMessage,
  masterAlchemMood,
  children,
  actions,
  onAction,
  sidePanel,
  challenge,
  reward,
  allowCompactMode = true,
}: LabShellProps) {
  return (
    <div className="relative overflow-hidden bg-[radial-gradient(circle_at_10%_10%,rgba(34,211,238,0.2),transparent_30%),radial-gradient(circle_at_90%_10%,rgba(167,139,250,0.2),transparent_28%),linear-gradient(180deg,#f8fbff_0%,#eef9ff_45%,#fff7ed_100%)] py-3 sm:py-4">
      <Container className="relative">
        <div
          className={cn(
            "grid gap-3",
            allowCompactMode
              ? "min-h-[calc(100svh-6.5rem)] grid-rows-[auto_minmax(22rem,1fr)_auto]"
              : "min-h-[calc(100svh-6.5rem)]",
          )}
        >
          <LabHUD title={title} phase={phase} progress={progress} xp={xp} badge={badge} voltage={voltage} />
          {subtitle ? <p className="sr-only">{subtitle}</p> : null}

          <div className="grid min-h-0 gap-3 xl:grid-cols-[minmax(0,1fr)_20rem]">
            <LabStage>{children}</LabStage>
            <div className="grid content-start gap-3 xl:max-h-[calc(100svh-13rem)] xl:overflow-y-auto xl:pr-1">
              <MasterAlchemLabGuide message={masterAlchemMessage} mood={masterAlchemMood} />
              {sidePanel}
              {challenge}
              {reward}
            </div>
          </div>

          <StepActionBar actions={actions} onAction={onAction} />
        </div>
      </Container>
    </div>
  );
}
