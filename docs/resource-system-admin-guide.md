# Chemlab Resource System Admin Guide

Chemlab resources are managed in the Hostinger backend and displayed by the Vercel frontend. Stage 3 makes the system usable without a full CMS rebuild.

## Resource Structure

Use `/admin/resources/structure` in this order:

1. Classes: Class 9, 10, 11, and 12.
2. Subjects: Science for Classes 9 and 10, Chemistry for Classes 11 and 12.
3. Books: NCERT or custom reference containers.
4. Chapters: chapter shells with stable slugs.
5. Topics: small learning goals inside chapters.

IDs from these records are used by resource, deck, drill, concept-map, and mistake-pattern forms.

## Learning Resources

Use `/admin/resources` to create or edit records in `learning_resources`.

Important fields:

- `type`: simulation, story_lab, memory_deck, quick_drill, concept_map, revision_note, and more.
- `route_url`: Next.js route for an existing lab, such as `/labs/redox-transfer-kitchen`.
- `class_id`, `subject_id`, `chapter_id`, `topic_id`: placement in the learning map.
- `content_json`: optional structured content for future public views.
- `source_reference`: short source note. Do not paste full textbook content here.
- `status`: draft, published, archived.

Use Publish and Archive from the resource table for lifecycle changes.

## Existing Seeded Simulations

Stage 1 seeded:

- Redox Transfer Kitchen: `/labs/redox-transfer-kitchen`, suggested Class 10.
- Hydrocarbon Naming Quest: `/labs/hydrocarbon-naming-quest`, suggested Class 11.

These are still Next.js simulations. The backend resource record stores metadata and placement only.

## Memory Decks And Cards

Use `/admin/memory-cards` to create decks. Open a deck with the Cards action to manage its cards.

Good card shape:

- Front: one recall prompt.
- Back: concise answer.
- Hint: a small clue.
- Explanation: one supportive correction.

Seed examples:

- Redox LEO and GER Memory Deck.
- IUPAC Starter Memory Deck.

## Quick Drills And Questions

Use `/admin/quick-drills` to create drills. Open a drill with the Questions action.

For MCQ questions, store:

- `options_json`: an array like `["Oxidation","Reduction"]`.
- `correct_answer_json`: an array like `["Oxidation"]`.

Keep explanations short and student-facing.

## Concept Maps

Use `/admin/concept-maps`.

`map_json` is flexible. A simple shape is:

```json
{
  "nodes": ["Electron transfer", "Oxidation", "Reduction"],
  "edges": [
    { "from": "Electron transfer", "to": "Oxidation" }
  ]
}
```

Stage 4 can turn this data into richer student visuals.

## Mistake Patterns

Use `/admin/mistake-patterns` to record common misunderstandings.

Each pattern should include:

- `mistake_key`: stable identifier.
- `title`: readable issue name.
- `description`: what students do wrong.
- `correction`: what to try instead.
- `example`: one concrete chemistry example.

These records will later power mistake review and Chem-Shastri hints.

## Content And Translations

Use `/admin/content` for block keys. Use `/admin/translations` for language-specific values.

Recommended key style:

- `homepage.hero.title`
- `labs.redox.description`
- `chem_shastri.welcome_message`

## Media

Use `/admin/media` for safe image uploads.

Allowed MIME types are configured in Hostinger backend env. Stage 3 supports JPG, PNG, WebP, and SVG. Do not upload raw generated assets with visible checkerboard backgrounds for live pages.

## Email And Notifications

Use `/admin/email` to edit templates, send a test email, and inspect logs.

Use `/admin/notifications` for role-targeted announcements. Push notifications and scheduled sends are later stages.

## Deployment Notes

After uploading backend changes to Hostinger:

1. Run `composer install`.
2. Run `php src/database/migrate.php`.
3. Run `php src/database/seed.php`.
4. Log in as admin.
5. Test `/api/admin/resources`.
6. Test the Vercel admin UI with `NEXT_PUBLIC_BACKEND_URL=https://api.chemlearning.in`.

No real secrets should be stored in content, resources, or settings. Keep DB, SMTP, and AI credentials in environment variables only.
