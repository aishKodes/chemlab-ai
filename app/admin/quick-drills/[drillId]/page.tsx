"use client";

import { use } from "react";
import { AdminEntityManager } from "@/components/admin/AdminEntityManager";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { adminApi } from "@/lib/api/adminApi";
import type { BackendQuizQuestion } from "@/lib/api/backendTypes";

export default function AdminQuizQuestionsPage({ params }: { params: Promise<{ drillId: string }> }) {
  const { drillId } = use(params);

  return (
    <>
      <PageHeader
        eyebrow="Admin / Quick Drills"
        title={`Questions for drill #${drillId}.`}
        description="Write answerable questions with clear hints and explanations. JSON fields accept arrays or objects."
      />
      <Container className="pb-16">
        <AdminEntityManager<BackendQuizQuestion & Record<string, unknown>>
          title="Quiz Questions"
          description="Questions can be MCQ, multi-select, true/false, or short answer."
          listKey="questions"
          fetchItems={() => adminApi.getQuizQuestions(drillId)}
          createItem={adminApi.createQuizQuestion}
          updateItem={adminApi.updateQuizQuestion}
          deleteItem={adminApi.deleteQuizQuestion}
          columns={[
            { key: "id", label: "ID" },
            { key: "question_text", label: "Question" },
            { key: "question_type", label: "Type" },
            { key: "difficulty", label: "Difficulty" },
            { key: "status", label: "Status" },
          ]}
          fields={[
            { name: "drill_id", label: "Drill ID", type: "number", required: true },
            { name: "class_id", label: "Class ID", type: "number" },
            { name: "subject_id", label: "Subject ID", type: "number" },
            { name: "chapter_id", label: "Chapter ID", type: "number" },
            { name: "topic_id", label: "Topic ID", type: "number" },
            { name: "question_text", label: "Question", type: "textarea", required: true },
            { name: "question_type", label: "Question type", type: "select", options: ["mcq", "multi_select", "true_false", "short_answer"].map((value) => ({ label: value, value })) },
            { name: "options_json", label: "Options JSON", type: "json", placeholder: "[\"Option A\",\"Option B\"]" },
            { name: "correct_answer_json", label: "Correct answer JSON", type: "json", placeholder: "[\"Option A\"]" },
            { name: "explanation", label: "Explanation", type: "textarea" },
            { name: "hint", label: "Hint", type: "textarea" },
            { name: "difficulty", label: "Difficulty", type: "select", options: ["beginner", "intermediate", "advanced"].map((value) => ({ label: value, value })) },
            { name: "mistake_type", label: "Mistake type" },
            { name: "source_reference", label: "Source reference", type: "textarea" },
            { name: "order_index", label: "Order", type: "number" },
            { name: "status", label: "Status", type: "select", options: ["draft", "published", "archived"].map((value) => ({ label: value, value })) },
          ]}
          defaultValues={{ drill_id: Number(drillId), question_type: "mcq", difficulty: "beginner", order_index: 0, status: "published" }}
        />
      </Container>
    </>
  );
}
