import path from "node:path";

export function parseNcertFilename(filePath: string) {
  const base = path.basename(filePath, path.extname(filePath));
  const classMatch = filePath.match(/class[-_ ]?(\d+)/i) || base.match(/class[-_ ]?(\d+)/i);
  const classLevel = classMatch?.[1];
  const subject = /chem/i.test(base) || /science/i.test(base) ? "chemistry" : "chemistry";
  const title = base
    .replace(/[_-]+/g, " ")
    .replace(/\bclass\s*\d+\b/i, "")
    .replace(/\b(ncert|official|pdf)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  return {
    classLevel,
    subject,
    bookTitle: title || `NCERT Class ${classLevel || ""} Chemistry`,
    bookCode: base,
    language: "en",
  };
}

export function chapterSlugFromTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}
