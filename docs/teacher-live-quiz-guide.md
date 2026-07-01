# Teacher Live Quiz Guide

Chemlab live quizzes let a teacher open a short chemistry battle, share a 6-digit PIN, and watch student answers arrive.

## Teacher Flow

1. Log in as a teacher or admin.
2. Open `/teacher/quizzes`.
3. Create a quiz at `/teacher/quizzes/create`.
4. Optionally enter a source quick drill ID to copy existing questions.
5. Open the quiz and click **Start live room**.
6. Share the 6-digit PIN or join link with students.
7. Keep `/teacher/live/{sessionId}` open for live results.
8. End the room when class is finished.

## Student Flow

1. Open `/join`.
2. Enter the 6-digit PIN.
3. Enter a display name.
4. Answer one question at a time.
5. Finish the quiz so the teacher sees the final score.

## Public Practice

Public quizzes are available at `/public-quizzes`.

Seeded starter quizzes:

- Redox Transfer Starter Battle
- Hydrocarbon Naming Starter Battle

These can be used for student practice even outside a live room.

## Stage 7 Limits

- Question editing remains basic and should be expanded in the next admin stage.
- Guest room participant tokens are stored in local browser storage for Stage 7.
- Live result refresh is polling-based.
