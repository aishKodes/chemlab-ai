/* eslint-disable @next/next/no-img-element */

import { hydrocarbonQuestAssetManifest } from "@/components/labs/hydrocarbon-quest/hydrocarbonAssetManifest";
import type { HydrocarbonQuestAsset } from "@/components/labs/hydrocarbon-quest/hydrocarbonAssetManifest";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

const previewBackgrounds = [
  { label: "white", className: "bg-white" },
  { label: "dark", className: "bg-slate-950" },
  { label: "blue", className: "bg-blue-500" },
  { label: "gradient", className: "bg-gradient-to-br from-cyan-300 via-violet-300 to-amber-200" },
];

export function HydrocarbonAssetDebug() {
  const assets = Object.values(hydrocarbonQuestAssetManifest.assets) as HydrocarbonQuestAsset[];

  return (
    <Container className="py-10">
      <div className="mb-8">
        <Badge tone="amber">Development only</Badge>
        <h1 className="mt-3 text-4xl font-black text-slate-950">Hydrocarbon Quest Asset Check</h1>
        <p className="mt-3 max-w-3xl text-sm font-bold leading-6 text-slate-700">
          Character assets must look clean on every background before they are used in the live quest. Raw assets are listed for traceability, but the simulation uses processed web assets.
        </p>
      </div>
      <div className="grid gap-5">
        {assets.map((asset) => (
          <Card key={asset.key} className="bg-white">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-slate-950">{asset.label}</h2>
                <p className="mt-1 break-all text-xs font-bold text-slate-500">{asset.rawPath}</p>
              </div>
              <Badge tone={asset.status === "ok" ? "green" : asset.status === "missing" ? "rose" : "amber"}>
                {asset.status === "ok" ? "ok" : asset.status === "missing" ? "missing" : "checkerboard suspected"}
              </Badge>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {previewBackgrounds.map((background) => (
                <div key={background.label} className="overflow-hidden rounded-3xl border border-slate-200">
                  <div className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-600">
                    {background.label}
                  </div>
                  <div className={`grid h-56 place-items-center p-3 ${background.className}`}>
                    {asset.status === "missing" || !asset.webPath ? (
                      <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm font-black text-rose-700">Missing</div>
                    ) : (
                      <img
                        src={asset.webPath}
                        alt={asset.label}
                        className={asset.kind === "character" ? "max-h-52 max-w-full object-contain" : "h-full w-full rounded-2xl object-cover"}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-2 rounded-3xl bg-slate-50 p-4 text-sm font-bold text-slate-700 md:grid-cols-3">
              <p>Live use: {asset.status === "ok" ? "yes" : "no"}</p>
              <p>Transparency: {asset.hasAlpha ? "has alpha" : "solid background"}</p>
              <p>Checkerboard: {asset.checkerboardSuspected ? "suspected" : "not detected"}</p>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}
