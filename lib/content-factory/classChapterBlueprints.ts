import { class11SomeBasicConceptsContentPack } from "@/data/content-packs/class-11/some-basic-concepts-of-chemistry";
import type { ChapterContentBlueprint, ChapterContentPack } from "@/lib/content-factory/contentBlueprintTypes";

export const chapterContentPacks: ChapterContentPack[] = [class11SomeBasicConceptsContentPack];

export const classChapterBlueprints: ChapterContentBlueprint[] = chapterContentPacks.map((pack) => pack.blueprint);

export function getChapterContentPack(slug: string) {
  return chapterContentPacks.find((pack) => pack.blueprint.chapterSlug === slug);
}
