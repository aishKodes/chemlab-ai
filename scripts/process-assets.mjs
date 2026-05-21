import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const scanDirs = [
  "assets",
  "public/brand",
  "public/assets",
  "public/scenes",
  "public/labs",
  "public/characters",
  "public/_quarantine/bad-assets",
];
const sourceDir = path.join(root, "public/_source-assets");
const processedDir = path.join(root, "public/processed");
const manifestPath = path.join(processedDir, "asset-manifest.json");
const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const siteUsed = new Set([
  "assets/chemlab-classroom.png",
  "assets/chemlab-magical-lab-background.png",
  "assets/chemlab-virtual-lab-bench.png",
]);

function relativeToRoot(filePath) {
  return path.relative(root, filePath).split(path.sep).join("/");
}

function publicUrl(publicRelativePath) {
  return `/${publicRelativePath.replace(/^public\//, "")}`;
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function collectImages(dir) {
  const fullDir = path.join(root, dir);
  if (!(await pathExists(fullDir))) return [];

  const entries = await fs.readdir(fullDir, { withFileTypes: true });
  const images = [];
  for (const entry of entries) {
    const fullPath = path.join(fullDir, entry.name);
    const rel = relativeToRoot(fullPath);
    if (entry.isDirectory()) {
      if (rel.startsWith("public/_source-assets") || rel.startsWith("public/processed")) continue;
      images.push(...(await collectImages(rel)));
    } else if (imageExtensions.has(path.extname(entry.name).toLowerCase())) {
      images.push(fullPath);
    }
  }
  return images;
}

function isGrayCheckerCandidate(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const average = (r + g + b) / 3;
  const neutral = max - min <= 16;
  const checkerGray = average >= 145 && average <= 246;
  const paleSquare = average >= 220 && neutral;
  return neutral && (checkerGray || paleSquare);
}

async function analyzeImage(filePath) {
  const metadata = await sharp(filePath).metadata();
  const probe = await sharp(filePath)
    .resize({ width: 256, height: 256, fit: "inside", withoutEnlargement: true })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = probe.info;
  const data = probe.data;
  let grayTotal = 0;
  let borderTotal = 0;
  let grayBorder = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * channels;
      const gray = isGrayCheckerCandidate(data[offset], data[offset + 1], data[offset + 2]);
      if (gray) grayTotal += 1;
      const border = x < 10 || y < 10 || x >= width - 10 || y >= height - 10;
      if (border) {
        borderTotal += 1;
        if (gray) grayBorder += 1;
      }
    }
  }

  const grayRatio = grayTotal / (width * height);
  const borderGrayRatio = borderTotal === 0 ? 0 : grayBorder / borderTotal;
  const rel = relativeToRoot(filePath);
  const alphaSafe = Boolean(metadata.hasAlpha);
  const quarantined = rel.startsWith("public/_quarantine/bad-assets/");
  const likelyCheckerboard = quarantined || (!alphaSafe && borderGrayRatio > 0.42 && grayRatio > 0.2);

  return {
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
    hasAlpha: alphaSafe,
    grayRatio: Number(grayRatio.toFixed(3)),
    borderGrayRatio: Number(borderGrayRatio.toFixed(3)),
    likelyCheckerboard,
  };
}

async function removeBorderConnectedCheckerboard(filePath, outputPath) {
  const image = sharp(filePath).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const visited = new Uint8Array(width * height);
  const queue = [];

  function pixelIndex(x, y) {
    return y * width + x;
  }

  function offsetFor(x, y) {
    return pixelIndex(x, y) * channels;
  }

  function pushIfChecker(x, y) {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const idx = pixelIndex(x, y);
    if (visited[idx]) return;
    const offset = offsetFor(x, y);
    if (!isGrayCheckerCandidate(data[offset], data[offset + 1], data[offset + 2])) return;
    visited[idx] = 1;
    queue.push([x, y]);
  }

  for (let x = 0; x < width; x += 1) {
    pushIfChecker(x, 0);
    pushIfChecker(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    pushIfChecker(0, y);
    pushIfChecker(width - 1, y);
  }

  for (let i = 0; i < queue.length; i += 1) {
    const [x, y] = queue[i];
    pushIfChecker(x + 1, y);
    pushIfChecker(x - 1, y);
    pushIfChecker(x, y + 1);
    pushIfChecker(x, y - 1);
  }

  for (let i = 0; i < visited.length; i += 1) {
    if (visited[i]) data[i * channels + 3] = 0;
  }

  await sharp(data, { raw: { width, height, channels } }).png().toFile(outputPath);
}

async function processImage(filePath) {
  const rel = relativeToRoot(filePath);
  const parsed = path.parse(rel);
  const safeBase = `${parsed.dir.replaceAll("/", "__")}__${parsed.name}`.replace(/^__/, "");
  const sourceCopyRelative = `public/_source-assets/${rel}`;
  const sourceCopyPath = path.join(root, sourceCopyRelative);
  const outputPngRelative = `public/processed/${safeBase}.png`;
  const outputWebpRelative = `public/processed/${safeBase}.webp`;
  const outputPngPath = path.join(root, outputPngRelative);
  const outputWebpPath = path.join(root, outputWebpRelative);

  await fs.mkdir(path.dirname(sourceCopyPath), { recursive: true });
  await fs.mkdir(path.dirname(outputPngPath), { recursive: true });
  await fs.copyFile(filePath, sourceCopyPath);

  const analysis = await analyzeImage(filePath);
  let status = analysis.likelyCheckerboard ? "unsafe" : "clean";
  let processed = false;
  let failedReason = "";

  try {
    if (analysis.likelyCheckerboard) {
      await removeBorderConnectedCheckerboard(filePath, outputPngPath);
      status = "unsafe";
    } else {
      await sharp(filePath).png().toFile(outputPngPath);
    }
    await sharp(outputPngPath).webp({ quality: 90 }).toFile(outputWebpPath);
    processed = true;
  } catch (error) {
    status = "failed";
    failedReason = error instanceof Error ? error.message : "Unknown processing error";
  }

  return {
    filename: path.basename(filePath),
    sourcePath: rel,
    sourceCopyPath: sourceCopyRelative,
    rawUrl: rel.startsWith("public/") ? publicUrl(rel) : null,
    processedPath: processed ? outputPngRelative : null,
    processedUrl: processed ? publicUrl(outputPngRelative) : null,
    processedWebpPath: processed ? outputWebpRelative : null,
    processedWebpUrl: processed ? publicUrl(outputWebpRelative) : null,
    status,
    usedBySite: siteUsed.has(rel),
    failedReason,
    ...analysis,
  };
}

async function main() {
  await fs.mkdir(sourceDir, { recursive: true });
  await fs.mkdir(processedDir, { recursive: true });

  const images = (await Promise.all(scanDirs.map((dir) => collectImages(dir)))).flat();
  const uniqueImages = [...new Set(images)].sort();
  const assets = [];

  for (const image of uniqueImages) {
    assets.push(await processImage(image));
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    scanDirs,
    assets,
    summary: {
      total: assets.length,
      clean: assets.filter((asset) => asset.status === "clean").length,
      processed: assets.filter((asset) => Boolean(asset.processedPath)).length,
      checkerboard: assets.filter((asset) => asset.likelyCheckerboard).length,
      unsafe: assets.filter((asset) => asset.status === "unsafe").length,
      failed: assets.filter((asset) => asset.status === "failed").length,
      usedBySite: assets.filter((asset) => asset.usedBySite).length,
    },
  };

  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Processed ${assets.length} assets.`);
  console.log(`Manifest written to ${relativeToRoot(manifestPath)}.`);
  console.log(JSON.stringify(manifest.summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
