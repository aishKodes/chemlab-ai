import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Asset Preview",
  description: "Development-only Chemlab asset preview and processing audit.",
};

type ManifestAsset = {
  filename: string;
  sourcePath: string;
  sourceCopyPath: string;
  rawUrl: string | null;
  processedUrl: string | null;
  processedWebpUrl: string | null;
  status: "clean" | "checkerboard" | "processed" | "unsafe" | "failed";
  usedBySite: boolean;
  failedReason: string;
  hasAlpha: boolean;
  grayRatio: number;
  borderGrayRatio: number;
  likelyCheckerboard: boolean;
};

type AssetManifest = {
  generatedAt: string;
  summary: Record<string, number>;
  assets: ManifestAsset[];
};

function readManifest(): AssetManifest | null {
  const manifestPath = path.join(process.cwd(), "public/processed/asset-manifest.json");
  if (!fs.existsSync(manifestPath)) return null;
  return JSON.parse(fs.readFileSync(manifestPath, "utf8")) as AssetManifest;
}

function publicUrlFromPath(publicPath: string) {
  return `/${publicPath.replace(/^public\//, "")}`;
}

export default function AssetPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    return (
      <>
        <PageHeader
          eyebrow="Development"
          title="Asset Preview Disabled"
          description="Asset previews are available during local development only."
        />
        <Container className="pb-16">
          <Card className="bg-white/85">
            <p className="text-sm font-semibold text-slate-700">
              Run Chemlab locally to review clean, processed, and quarantined assets.
            </p>
          </Card>
        </Container>
      </>
    );
  }

  const manifest = readManifest();

  return (
    <>
      <PageHeader
        eyebrow="Development"
        title="Asset Preview"
        description="Review raw and processed assets before anything reaches student-facing pages."
      />
      <Container className="pb-16">
        {!manifest ? (
          <Card className="bg-amber-50">
            <h2 className="text-xl font-black text-slate-950">No manifest found</h2>
            <p className="mt-2 text-sm font-semibold text-slate-700">
              Run <code className="rounded bg-white px-1 py-0.5">npm run process:assets</code> to create
              <code className="ml-1 rounded bg-white px-1 py-0.5">public/processed/asset-manifest.json</code>.
            </p>
          </Card>
        ) : (
          <>
            <Card className="mb-6 bg-white/85">
              <h2 className="text-xl font-black text-slate-950">Processing summary</h2>
              <p className="mt-2 text-sm font-semibold text-slate-600">
                Generated {new Date(manifest.generatedAt).toLocaleString()}.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {Object.entries(manifest.summary).map(([key, value]) => (
                  <Badge key={key} tone={key === "failed" && value > 0 ? "rose" : "blue"}>
                    {key}: {value}
                  </Badge>
                ))}
              </div>
            </Card>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {manifest.assets.map((asset) => (
                <Card key={asset.sourcePath} className="overflow-hidden bg-white/85 p-0">
                  <div className="grid gap-px bg-slate-200">
                    <PreviewSet
                      label="Raw"
                      src={asset.rawUrl ?? publicUrlFromPath(asset.sourceCopyPath)}
                      filename={asset.filename}
                    />
                    <PreviewSet
                      label="Processed"
                      src={asset.processedUrl ?? publicUrlFromPath(asset.sourceCopyPath)}
                      filename={asset.filename}
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap gap-2">
                      <Badge tone={asset.usedBySite ? "green" : "slate"}>{asset.usedBySite ? "used by site" : "not used"}</Badge>
                      <Badge tone={asset.status === "unsafe" || asset.likelyCheckerboard ? "rose" : "blue"}>
                        {asset.status}
                      </Badge>
                      {asset.hasAlpha ? <Badge tone="green">alpha</Badge> : <Badge tone="amber">no alpha</Badge>}
                    </div>
                    <h2 className="mt-4 break-words text-lg font-black text-slate-950">{asset.filename}</h2>
                    <p className="mt-2 break-words text-xs font-bold text-slate-500">{asset.sourcePath}</p>
                    <p className="mt-3 text-xs font-semibold leading-5 text-slate-600">
                      border gray: {asset.borderGrayRatio}, full gray: {asset.grayRatio}
                    </p>
                    {asset.failedReason ? (
                      <p className="mt-3 rounded-2xl bg-rose-50 p-3 text-xs font-bold text-rose-700">
                        {asset.failedReason}
                      </p>
                    ) : null}
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </Container>
    </>
  );
}

function PreviewSet({
  src,
  filename,
  label,
}: {
  src: string;
  filename: string;
  label: string;
}) {
  return (
    <div>
      <div className="border-b border-slate-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-wide text-slate-600">
        {label}
      </div>
      <div className="grid grid-cols-3">
        <PreviewPane src={src} filename={filename} background="white" label="white" />
        <PreviewPane src={src} filename={filename} background="dark" label="dark" />
        <PreviewPane src={src} filename={filename} background="colour" label="colour" />
      </div>
    </div>
  );
}

function PreviewPane({
  src,
  filename,
  background,
  label,
}: {
  src: string;
  filename: string;
  background: "white" | "dark" | "colour";
  label: string;
}) {
  return (
    <div
      className={
        background === "white"
          ? "relative h-44 bg-white"
          : background === "dark"
            ? "relative h-44 bg-slate-950"
            : "relative h-44 bg-gradient-to-br from-cyan-200 via-violet-200 to-amber-100"
      }
    >
      <span className="absolute left-2 top-2 z-10 rounded-full bg-white/85 px-2 py-1 text-[10px] font-black text-slate-700">
        {label}
      </span>
      <Image src={src} alt={`${filename} ${label.toLowerCase()} preview`} fill sizes="(min-width: 1280px) 16vw, 50vw" className="object-contain p-3" />
    </div>
  );
}
