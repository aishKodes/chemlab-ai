import type { Metadata } from "next";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import chemlabClassroom from "@/assets/chemlab-classroom.png";
import magicalLabBackground from "@/assets/chemlab-magical-lab-background.png";
import virtualLabBench from "@/assets/chemlab-virtual-lab-bench.png";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Asset Preview",
  description: "Development-only Chemlab asset preview and quarantine audit.",
};

type AssetPreview = {
  filename: string;
  path: string;
  src: StaticImageData | string;
  used: boolean;
  checkerboardWarning: boolean;
  note: string;
};

const cleanAssets: AssetPreview[] = [
  {
    filename: "chemlab-classroom.png",
    path: "assets/chemlab-classroom.png",
    src: chemlabClassroom,
    used: true,
    checkerboardWarning: false,
    note: "Clean full-scene background.",
  },
  {
    filename: "chemlab-magical-lab-background.png",
    path: "assets/chemlab-magical-lab-background.png",
    src: magicalLabBackground,
    used: true,
    checkerboardWarning: false,
    note: "Clean full-scene background.",
  },
  {
    filename: "chemlab-virtual-lab-bench.png",
    path: "assets/chemlab-virtual-lab-bench.png",
    src: virtualLabBench,
    used: true,
    checkerboardWarning: false,
    note: "Clean full-scene background.",
  },
];

const quarantinedFilenames = [
  "acid-beaker.png",
  "base-beaker.png",
  "evaporation-dish-heating-plate.png",
  "indicator-bottle.png",
  "master-alchem-avatar.png",
  "master-alchem-celebrating.png",
  "master-alchem-hero.png",
  "master-alchem-idle.png",
  "master-alchem-lab-guide.png",
  "master-alchem-pointing.png",
  "master-alchem-reference.png",
  "master-alchem-thinking.png",
  "master-alchem-warning.png",
  "mixing-beaker-empty.png",
  "ph-meter.png",
  "salt-crystals.png",
  "student-girl-celebrating.png",
  "student-girl-curious.png",
  "student-girl-reference.png",
  "student-girl-worried.png",
];

const quarantinedAssets: AssetPreview[] = quarantinedFilenames.map((filename) => ({
  filename,
  path: `public/_quarantine/bad-assets/${filename}`,
  src: `/_quarantine/bad-assets/${filename}`,
  used: false,
  checkerboardWarning: true,
  note: "Quarantined: RGB PNG with baked checkerboard-looking transparency.",
}));

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
              Run Chemlab locally to review clean and quarantined generated assets.
            </p>
          </Card>
        </Container>
      </>
    );
  }

  const assets = [...cleanAssets, ...quarantinedAssets];

  return (
    <>
      <PageHeader
        eyebrow="Development"
        title="Asset Preview"
        description="Review which generated assets are safe to use and which are quarantined before they reach student pages."
      />
      <Container className="pb-16">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {assets.map((asset) => (
            <Card key={asset.path} className="overflow-hidden bg-white/85 p-0">
              <div className="grid grid-cols-2">
                <PreviewPane asset={asset} background="white" />
                <PreviewPane asset={asset} background="colour" />
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  <Badge tone={asset.used ? "green" : "slate"}>{asset.used ? "used" : "unused"}</Badge>
                  {asset.checkerboardWarning ? <Badge tone="rose">checkerboard warning</Badge> : <Badge tone="blue">clean</Badge>}
                </div>
                <h2 className="mt-4 break-words text-lg font-black text-slate-950">{asset.filename}</h2>
                <p className="mt-2 break-words text-xs font-bold text-slate-500">{asset.path}</p>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">{asset.note}</p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </>
  );
}

function PreviewPane({ asset, background }: { asset: AssetPreview; background: "white" | "colour" }) {
  return (
    <div className={background === "white" ? "relative h-44 bg-white" : "relative h-44 bg-gradient-to-br from-cyan-200 via-violet-200 to-amber-100"}>
      <Image src={asset.src} alt={`${asset.filename} preview`} fill sizes="(min-width: 1280px) 16vw, 50vw" className="object-contain p-3" />
    </div>
  );
}
