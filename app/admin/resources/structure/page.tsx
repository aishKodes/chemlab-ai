"use client";

import { AdminEntityManager } from "@/components/admin/AdminEntityManager";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { adminApi } from "@/lib/api/adminApi";
import type { BackendBook, BackendChapter, BackendClass, BackendSubject, BackendTopic } from "@/lib/api/backendTypes";

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Hidden", value: "hidden" },
];

const publishOptions = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
];

export default function AdminResourceStructurePage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin / Resource Structure"
        title="Class-wise learning structure."
        description="Build classes, subjects, books, chapters, and topics. Seeded NCERT shells are editable drafts: verify the current syllabus before publishing."
      />
      <Container className="space-y-8 pb-16">
        <AdminEntityManager<BackendClass & Record<string, unknown>>
          title="Classes"
          description="Class 9 to 12 learning lanes."
          listKey="classes"
          fetchItems={adminApi.getAdminClasses}
          createItem={adminApi.createClass}
          updateItem={adminApi.updateClass}
          columns={[
            { key: "id", label: "ID" },
            { key: "class_level", label: "Class" },
            { key: "display_name", label: "Display name" },
            { key: "status", label: "Status" },
          ]}
          fields={[
            { name: "class_level", label: "Class level", type: "select", required: true, options: ["9", "10", "11", "12"].map((value) => ({ label: `Class ${value}`, value })) },
            { name: "display_name", label: "Display name", required: true },
            { name: "status", label: "Status", type: "select", options: statusOptions },
          ]}
          defaultValues={{ status: "active" }}
        />

        <AdminEntityManager<BackendSubject & Record<string, unknown>>
          title="Subjects"
          description="Science for Classes 9 and 10, Chemistry for Classes 11 and 12."
          listKey="subjects"
          fetchItems={adminApi.getSubjects}
          createItem={adminApi.createSubject}
          updateItem={adminApi.updateSubject}
          columns={[
            { key: "id", label: "ID" },
            { key: "class_id", label: "Class ID" },
            { key: "name", label: "Subject" },
            { key: "subject_type", label: "Type" },
            { key: "status", label: "Status" },
          ]}
          fields={[
            { name: "class_id", label: "Class ID", type: "number", required: true },
            { name: "name", label: "Subject name", required: true },
            { name: "subject_type", label: "Subject type", type: "select", required: true, options: [{ label: "Science", value: "science" }, { label: "Chemistry", value: "chemistry" }] },
            { name: "status", label: "Status", type: "select", options: statusOptions },
          ]}
          defaultValues={{ status: "active" }}
        />

        <AdminEntityManager<BackendBook & Record<string, unknown>>
          title="Books"
          description="Reference books or original Chemlab collections."
          listKey="books"
          fetchItems={adminApi.getBooks}
          createItem={adminApi.createBook}
          updateItem={adminApi.updateBook}
          columns={[
            { key: "id", label: "ID" },
            { key: "class_id", label: "Class ID" },
            { key: "subject_id", label: "Subject ID" },
            { key: "title", label: "Title" },
            { key: "status", label: "Status" },
          ]}
          fields={[
            { name: "class_id", label: "Class ID", type: "number", required: true },
            { name: "subject_id", label: "Subject ID", type: "number", required: true },
            { name: "title", label: "Book title", required: true },
            { name: "source", label: "Source", type: "select", options: [{ label: "NCERT", value: "NCERT" }, { label: "Custom", value: "CUSTOM" }] },
            { name: "language", label: "Language", required: true },
            { name: "status", label: "Status", type: "select", options: publishOptions },
          ]}
          defaultValues={{ source: "NCERT", language: "en", status: "draft" }}
        />

        <AdminEntityManager<BackendChapter & Record<string, unknown>>
          title="Chapters"
          description="Chapter shells that can hold topics, simulations, and resource sets."
          listKey="chapters"
          fetchItems={adminApi.getChapters}
          createItem={adminApi.createChapter}
          updateItem={adminApi.updateChapter}
          columns={[
            { key: "id", label: "ID" },
            { key: "chapter_number", label: "No." },
            { key: "title", label: "Title" },
            { key: "slug", label: "Slug" },
            { key: "status", label: "Status" },
          ]}
          fields={[
            { name: "book_id", label: "Book ID", type: "number", required: true },
            { name: "class_id", label: "Class ID", type: "number", required: true },
            { name: "subject_id", label: "Subject ID", type: "number", required: true },
            { name: "chapter_number", label: "Chapter number", type: "number" },
            { name: "title", label: "Chapter title", required: true },
            { name: "slug", label: "Slug", required: true },
            { name: "status", label: "Status", type: "select", options: publishOptions },
          ]}
          defaultValues={{ status: "draft" }}
        />

        <AdminEntityManager<BackendTopic & Record<string, unknown>>
          title="Topics"
          description="Small learning targets that resources and practice can attach to."
          listKey="topics"
          fetchItems={adminApi.getTopics}
          createItem={adminApi.createTopic}
          updateItem={adminApi.updateTopic}
          columns={[
            { key: "id", label: "ID" },
            { key: "chapter_id", label: "Chapter ID" },
            { key: "title", label: "Title" },
            { key: "difficulty", label: "Difficulty" },
            { key: "status", label: "Status" },
          ]}
          fields={[
            { name: "chapter_id", label: "Chapter ID", type: "number", required: true },
            { name: "class_id", label: "Class ID", type: "number", required: true },
            { name: "subject_id", label: "Subject ID", type: "number", required: true },
            { name: "title", label: "Topic title", required: true },
            { name: "slug", label: "Slug", required: true },
            { name: "order_index", label: "Order", type: "number" },
            { name: "difficulty", label: "Difficulty", type: "select", options: [{ label: "Beginner", value: "beginner" }, { label: "Intermediate", value: "intermediate" }, { label: "Advanced", value: "advanced" }] },
            { name: "status", label: "Status", type: "select", options: publishOptions },
          ]}
          defaultValues={{ difficulty: "beginner", status: "draft" }}
        />
      </Container>
    </>
  );
}
