import { backendClient } from "@/lib/api/backendClient";
import type { BackendClassroom, BackendTeacherAssignment } from "@/lib/api/backendTypes";

export const teacherApi = {
  getOverview: () => backendClient.get<{ summary: Record<string, number>; recent_activity?: unknown[] }>("/api/teacher/analytics/overview"),
  getAnalyticsClassrooms: () => backendClient.get<{ classrooms: BackendClassroom[] }>("/api/teacher/analytics/classrooms"),
  getClassrooms: () => backendClient.get<{ classrooms: BackendClassroom[] }>("/api/teacher/classrooms"),
  createClassroom: (payload: Partial<BackendClassroom>) =>
    backendClient.post<{ classroom_id: number; join_code: string }>("/api/teacher/classrooms", payload),
  getClassroom: (id: string | number) =>
    backendClient.get<{ classroom: BackendClassroom; students: unknown[]; assignments: BackendTeacherAssignment[] }>(
      `/api/teacher/classrooms/${id}`,
    ),
  regenerateJoinCode: (id: string | number) =>
    backendClient.post<{ join_code: string }>(`/api/teacher/classrooms/${id}/join-code/regenerate`),
  createAssignment: (classroomId: string | number, payload: Partial<BackendTeacherAssignment>) =>
    backendClient.post<{ assignment_id: number }>(`/api/teacher/classrooms/${classroomId}/assignments`, payload),
  getAssignments: () => backendClient.get<{ assignments: BackendTeacherAssignment[] }>("/api/teacher/assignments"),
  joinClassroom: (join_code: string) => backendClient.post<{ joined: boolean; classroom: BackendClassroom }>("/api/student/classrooms/join", { join_code }),
  getStudentAssignments: () => backendClient.get<{ assignments: BackendTeacherAssignment[] }>("/api/student/assignments"),
};
