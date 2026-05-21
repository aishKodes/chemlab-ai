"use client";

export type LocalLabProgress = {
  startedLabs: Record<string, string>;
  completedLabs: Record<string, { completedAt: string; xp: number }>;
  badges: Record<string, string>;
};

const STORAGE_KEY = "chemlab:lab-progress";

const emptyProgress: LocalLabProgress = {
  startedLabs: {},
  completedLabs: {},
  badges: {},
};

export function getLocalLabProgress(): LocalLabProgress {
  if (typeof window === "undefined") return emptyProgress;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress;
    return { ...emptyProgress, ...JSON.parse(raw) };
  } catch {
    return emptyProgress;
  }
}

export function markLabStarted(labSlug: string) {
  if (typeof window === "undefined") return;
  const progress = getLocalLabProgress();
  progress.startedLabs[labSlug] = new Date().toISOString();
  saveProgress(progress);
}

export function markLabCompleted(labSlug: string, xp: number) {
  if (typeof window === "undefined") return;
  const progress = getLocalLabProgress();
  progress.completedLabs[labSlug] = { completedAt: new Date().toISOString(), xp };
  saveProgress(progress);
}

export function awardLocalBadge(badgeId: string) {
  if (typeof window === "undefined") return;
  const progress = getLocalLabProgress();
  progress.badges[badgeId] = new Date().toISOString();
  saveProgress(progress);
}

function saveProgress(progress: LocalLabProgress) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
