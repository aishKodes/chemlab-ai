import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const cwd = process.cwd();
const root = path.join(cwd, "public", "assets", "redox-transfer-kitchen");
const rawDir = path.join(root, "raw");
const processedDir = path.join(root, "processed");
const webDir = path.join(root, "web");
const notesPath = path.join(root, "manifest-notes.md");

const roleOrder = [
  ["story_confused_kitchen", "story-confused-kitchen", "story", "Opening where Karthik is confused and Jaya Paati approaches."],
  ["story_empty_kitchen", "story-empty-kitchen", "story", "Clean Chennai kitchen background for readable teaching overlays."],
  ["karthik_confused_character", "karthik-confused-character", "character", "Karthik in confused student pose."],
  ["karthik_realization_character", "karthik-realization-character", "character", "Karthik after the redox idea clicks."],
  ["paati_explaining_character", "paati-explaining-character", "character", "Jaya Paati explaining the murukku analogy."],
  ["paati_giving_murukku_character", "paati-giving-murukku-character", "character", "Jaya Paati giving murukku/snack."],
  ["story_guidance_kitchen", "story-guidance-kitchen", "story", "Paati guiding Karthik at the kitchen table."],
  ["transition_kitchen_to_science", "transition-kitchen-to-science", "story", "Magical kitchen-to-chemistry transition frame."],
  ["redox_game_board_background", "redox-game-board-background", "game", "Blue chemistry board background for the 3D electron-transfer game."],
  ["redox_success_or_magic_background", "redox-success-or-magic-background", "success", "Warm completion/success scene."],
];

function looksLikeCheckerPixel(r, g, b) {
  const spread = Math.max(r, g, b) - Math.min(r, g, b);
  const avg = (r + g + b) / 3;
  return spread < 18 && avg > 150 && avg <= 255;
}

async function removeBorderCheckerboard(inputPath, outputPath) {
  const image = sharp(inputPath).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const queue = [];
  const seen = new Uint8Array(width * height);

  function push(x, y) {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const index = y * width + x;
    if (seen[index]) return;
    const offset = index * channels;
    if (!looksLikeCheckerPixel(data[offset], data[offset + 1], data[offset + 2])) return;
    seen[index] = 1;
    queue.push([x, y]);
  }

  for (let x = 0; x < width; x += 1) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    push(0, y);
    push(width - 1, y);
  }

  while (queue.length > 0) {
    const [x, y] = queue.pop();
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
    push(x + 1, y + 1);
    push(x + 1, y - 1);
    push(x - 1, y + 1);
    push(x - 1, y - 1);
  }

  for (let i = 0; i < seen.length; i += 1) {
    if (!seen[i]) continue;
    data[i * channels + 3] = 0;
  }

  await sharp(data, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);
}

async function main() {
  await fs.mkdir(processedDir, { recursive: true });
  await fs.mkdir(webDir, { recursive: true });

  let files = [];
  try {
    files = (await fs.readdir(rawDir))
      .filter((file) => /\.(png|jpe?g|webp)$/i.test(file))
      .sort();
  } catch {
    files = [];
  }

  const rows = [];
  const manifest = {};

  for (let index = 0; index < roleOrder.length; index += 1) {
    const [role, slug, kind, note] = roleOrder[index];
    const file = files[index];
    if (!file) {
      manifest[role] = {
        role,
        file: null,
        rawSrc: null,
        processedSrc: null,
        webSrc: null,
        kind,
        status: "missing",
        width: null,
        height: null,
        hasAlpha: false,
        checkerboardSuspected: kind === "character",
        usedIn: kind,
        note,
      };
      rows.push(`| ${role} | missing | - | missing | ${note} |`);
      continue;
    }

    const rawPath = path.join(rawDir, file);
    const metadata = await sharp(rawPath).metadata();
    const rawSrc = `/assets/redox-transfer-kitchen/raw/${file}`;
    const checkerboardSuspected = kind === "character" && !metadata.hasAlpha;
    let processedSrc = null;
    let webSrc = null;
    let status = "clean";

    if (kind === "character") {
      const outputName = `${slug}.png`;
      const outputPath = path.join(processedDir, outputName);
      await removeBorderCheckerboard(rawPath, outputPath);
      processedSrc = `/assets/redox-transfer-kitchen/processed/${outputName}`;
      webSrc = processedSrc;
      status = checkerboardSuspected ? "processed-checkerboard" : "processed";
    } else {
      const outputName = `${slug}.webp`;
      await sharp(rawPath)
        .resize(1672, 941, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 86 })
        .toFile(path.join(webDir, outputName));
      webSrc = `/assets/redox-transfer-kitchen/web/${outputName}`;
      status = "web";
    }

    manifest[role] = {
      role,
      file,
      rawSrc,
      processedSrc,
      webSrc,
      kind,
      status,
      width: metadata.width,
      height: metadata.height,
      hasAlpha: Boolean(metadata.hasAlpha),
      checkerboardSuspected,
      usedIn: kind,
      note,
    };

    rows.push(`| ${role} | ${file} | ${metadata.width}x${metadata.height} | ${status} | ${note} |`);
  }

  await fs.writeFile(path.join(root, "asset-manifest.json"), JSON.stringify({ generatedAt: new Date().toISOString(), source: rawDir, assets: manifest }, null, 2));
  await fs.writeFile(
    notesPath,
    [
      "# Redox Transfer Kitchen Asset Manifest",
      "",
      `Source folder: \`${rawDir}\``,
      "",
      "The four standalone character images arrived without alpha, so the processor writes transparent PNG attempts into `processed/` and production components use those processed files.",
      "",
      "| Role | Source file | Size | Status | Notes |",
      "| --- | --- | --- | --- | --- |",
      ...rows,
      "",
    ].join("\n"),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
