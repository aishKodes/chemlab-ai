import type { BackendLiveQuizParticipant, BackendLiveQuizSession, BackendTeacherQuiz, BackendTeacherQuizQuestion } from "@/lib/api/backendTypes";

export type StoredLiveQuizRoom = {
  session: BackendLiveQuizSession;
  participant: BackendLiveQuizParticipant;
  participant_token: string;
  quiz: BackendTeacherQuiz;
  questions: BackendTeacherQuizQuestion[];
};

const keyForSession = (sessionId: string | number) => `chemlab_live_quiz_${sessionId}`;

export function storeLiveQuizRoom(room: StoredLiveQuizRoom) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(keyForSession(room.session.uuid || room.session.id), JSON.stringify(room));
  window.localStorage.setItem("chemlab_live_quiz_last", JSON.stringify(room));
}

export function getLiveQuizRoom(sessionId: string | number): StoredLiveQuizRoom | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(keyForSession(sessionId)) ?? window.localStorage.getItem("chemlab_live_quiz_last");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredLiveQuizRoom;
    if (String(parsed.session.uuid) === String(sessionId) || String(parsed.session.id) === String(sessionId) || !sessionId) return parsed;
    return parsed;
  } catch {
    return null;
  }
}
