import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const rawRoots = [path.join(root, "public/assets/hydrocarbon-quest/raw")];
const outputRoot = path.join(root, "public/assets/hydrocarbon-quest");
const processedDir = path.join(outputRoot, "processed");
const webDir = path.join(outputRoot, "web");
const manifestPath = path.join(outputRoot, "asset-manifest.json");
const componentManifestPath = path.join(root, "components/labs/hydrocarbon-quest/hydrocarbonAssetManifest.ts");

const expectedAssets = [
  { key: "kabirReference", file: "kabir-reference", kind: "character", label: "Kabir reference" },
  { key: "kabirConfused", file: "kabir-confused", kind: "character", label: "Kabir confused" },
  { key: "kabirSuccess", file: "kabir-success", kind: "character", label: "Kabir success" },
  { key: "aparnaReference", file: "aparna-reference", kind: "character", label: "Aparna reference" },
  { key: "aparnaExplaining", file: "aparna-explaining", kind: "character", label: "Aparna explaining" },
  { key: "aparnaWarning", file: "aparna-warning", kind: "character", label: "Aparna warning" },
  { key: "aparnaCelebrating", file: "aparna-celebrating", kind: "character", label: "Aparna celebrating" },
  { key: "bgClassroom", file: "bg-classroom-chemistry", kind: "background", label: "Chemistry classroom" },
  { key: "bgKitchen", file: "bg-kitchen-lpg", kind: "background", label: "Kitchen LPG" },
  { key: "bgPuzzleBoard", file: "bg-hydrocarbon-puzzle-board", kind: "background", label: "Hydrocarbon puzzle board" },
  {
    key: "sceneFamilyAnalogy",
    file: "scene-family-analogy",
    kind: "scene",
    label: "Family naming classroom scene",
    ordinalHint: "(1)",
  },
  {
    key: "sceneFullNameRule",
    file: "scene-full-name-rule",
    kind: "scene",
    label: "Full-name rule classroom scene",
    ordinalHint: "(2)",
  },
  {
    key: "scenePortalLab",
    file: "scene-portal-lab",
    kind: "scene",
    label: "Cinematic lab portal scene",
    ordinalHint: "(3)",
  },
  {
    key: "sceneCleanPuzzleBoard",
    file: "scene-clean-puzzle-board",
    kind: "scene",
    label: "Clean puzzle board scene",
    ordinalHint: "(4)",
  },
  {
    key: "sceneButaneReference",
    file: "scene-butane-reference",
    kind: "reference",
    label: "Butane level reference frame",
    ordinalHint: "(5)",
  },
  {
    key: "sceneMethylpentaneReference",
    file: "scene-methylpentane-reference",
    kind: "reference",
    label: "2-Methylpentane level reference frame",
    ordinalHint: "(6)",
  },
  {
    key: "sceneButeneReference",
    file: "scene-butene-reference",
    kind: "reference",
    label: "But-1-ene level reference frame",
    ordinalHint: "(7)",
  },
  {
    key: "sceneAdvancedReference",
    file: "scene-advanced-reference",
    kind: "reference",
    label: "Senior-secondary challenge reference frame",
    ordinalHint: "(8)",
  },
  {
    key: "sceneQuestMap",
    file: "scene-quest-map",
    kind: "scene",
    label: "Hydrocarbon quest map scene",
    ordinalHint: "(9)",
  },
  {
    key: "sceneFinalBadge",
    file: "scene-final-badge",
    kind: "scene",
    label: "Hydrocarbon name master reward scene",
    ordinalHint: "(10)",
  },
];

await fs.mkdir(processedDir, { recursive: true });
await fs.mkdir(webDir, { recursive: true });
await fs.mkdir(path.dirname(componentManifestPath), { recursive: true });

const rawFiles = await collectRawFiles();
const assets = {};

for (const spec of expectedAssets) {
  const raw = findAsset(rawFiles, spec);
  if (!raw) {
    assets[spec.key] = {
      ...spec,
      status: "missing",
      rawPath: "",
      processedPath: "",
      webPath: "",
      hasAlpha: false,
      checkerboardSuspected: false,
      width: 0,
      height: 0,
      reason: "Expected asset was not found in public/assets/hydrocarbon-quest/raw or assets/hydrocarbon-quest/raw.",
    };
    continue;
  }

  const relativeRaw = path.relative(root, raw).replaceAll(path.sep, "/");
  const source = sharp(raw, { failOn: "none" });
  const metadata = await source.metadata();
  const hasAlpha = Boolean(metadata.hasAlpha);
  const checkerboardSuspected = await detectCheckerboard(raw);
  const isCharacter = spec.kind === "character";
  const safeForLiveUse = !isCharacter || (hasAlpha && !checkerboardSuspected);
  const ext = isCharacter ? "png" : "webp";
  const outBase = `${spec.file}.${ext}`;
  const processedOut = path.join(processedDir, outBase);
  const webOut = path.join(webDir, outBase);

  if (isCharacter) {
    await sharp(raw, { failOn: "none" }).png({ compressionLevel: 9 }).toFile(processedOut);
    await sharp(raw, { failOn: "none" }).png({ compressionLevel: 9 }).toFile(webOut);
  } else {
    await sharp(raw, { failOn: "none" }).webp({ quality: 88 }).toFile(processedOut);
    await sharp(raw, { failOn: "none" }).webp({ quality: 88 }).toFile(webOut);
  }

  assets[spec.key] = {
    ...spec,
    status: safeForLiveUse ? "ok" : "unsafe",
    rawPath: relativeRaw,
    processedPath: `/assets/hydrocarbon-quest/processed/${outBase}`,
    webPath: `/assets/hydrocarbon-quest/web/${outBase}`,
    hasAlpha,
    checkerboardSuspected,
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
    reason: safeForLiveUse
      ? "Ready for live use."
      : isCharacter && !hasAlpha
        ? "Character image has no alpha channel; live simulation will use silhouette fallback."
        : "Checkerboard-like background suspected; live simulation will use silhouette fallback.",
  };
}

const manifest = {
  generatedAt: new Date().toISOString(),
  rawRoots: rawRoots.map((item) => path.relative(root, item).replaceAll(path.sep, "/")),
  assets,
};

await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
await fs.writeFile(componentManifestPath, renderComponentManifest(manifest));

console.log(`Hydrocarbon assets prepared: ${Object.keys(assets).length}`);
console.log(`Manifest written to ${path.relative(root, manifestPath)}`);
console.log(`Component manifest written to ${path.relative(root, componentManifestPath)}`);

async function collectRawFiles() {
  const files = [];
  for (const dir of rawRoots) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isFile()) continue;
        if (entry.name.startsWith(".")) continue;
        if (!/\.(png|jpe?g|webp)$/i.test(entry.name)) continue;
        files.push(path.join(dir, entry.name));
      }
    } catch {
      // Missing raw folders are allowed.
    }
  }
  return files;
}

function findAsset(files, spec) {
  const normalized = normalizeName(spec.file);
  if (spec.ordinalHint) {
    const ordinalMatch = files.find((file) => path.basename(file).includes(spec.ordinalHint));
    if (ordinalMatch) return ordinalMatch;
  }
  return files.find((file) => normalizeName(path.basename(file, path.extname(file))) === normalized)
    ?? files.find((file) => normalizeName(path.basename(file, path.extname(file))).includes(normalized));
}

function normalizeName(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

async function detectCheckerboard(file) {
  const image = sharp(file, { failOn: "none" }).ensureAlpha();
  const metadata = await image.metadata();
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;
  if (width < 16 || height < 16) return false;

  const border = Math.max(8, Math.floor(Math.min(width, height) * 0.08));
  const raw = await image.raw().toBuffer();
  let grayLike = 0;
  let sampled = 0;
  const seen = new Map();

  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      const isBorder = x < border || y < border || x > width - border || y > height - border;
      if (!isBorder) continue;
      const idx = (y * width + x) * 4;
      const r = raw[idx];
      const g = raw[idx + 1];
      const b = raw[idx + 2];
      const a = raw[idx + 3];
      if (a < 12) continue;
      sampled += 1;
      const gray = Math.abs(r - g) < 14 && Math.abs(g - b) < 14;
      const mid = r > 90 && r < 235;
      if (gray && mid) {
        grayLike += 1;
        const bucket = Math.round(r / 18) * 18;
        seen.set(bucket, (seen.get(bucket) ?? 0) + 1);
      }
    }
  }

  if (sampled < 40) return false;
  const grayRatio = grayLike / sampled;
  const dominantGrayBuckets = [...seen.values()].filter((count) => count / Math.max(1, grayLike) > 0.14).length;
  return grayRatio > 0.42 && dominantGrayBuckets >= 2;
}

function renderComponentManifest(manifest) {
  return `// Generated by scripts/prepare-hydrocarbon-assets.mjs. Do not edit by hand.
export type HydrocarbonQuestAssetStatus = "ok" | "missing" | "unsafe";

export type HydrocarbonQuestAsset = {
  key: string;
  file: string;
  kind: "character" | "background" | "scene" | "reference";
  label: string;
  status: HydrocarbonQuestAssetStatus;
  rawPath: string;
  processedPath: string;
  webPath: string;
  hasAlpha: boolean;
  checkerboardSuspected: boolean;
  width: number;
  height: number;
  reason: string;
};

export const hydrocarbonQuestAssetManifest = ${JSON.stringify(manifest, null, 2)} as const;

export const hydrocarbonQuestAssets = hydrocarbonQuestAssetManifest.assets;
`;
}
