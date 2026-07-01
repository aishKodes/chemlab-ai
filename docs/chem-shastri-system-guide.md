# Chem-Shastri System Guide

Chem-Shastri is Chemlab's context-aware chemistry mentor. Stage 5 keeps the existing provider router and budget guard, then adds a `lib/chem-shastri` facade for product behavior.

## Request Flow

1. Validate safety.
2. Ask clarification only for genuinely incomplete prompts.
3. Answer common chemistry questions directly from local rules.
4. Retrieve relevant Chemlab resources from Hostinger public endpoints, with local simulation fallbacks.
5. Build page/class/role/language context.
6. Route harder questions through the existing Gemini-first AI router.
7. Log question metadata to Hostinger when available.

## Key Files

- `lib/chem-shastri/chemShastriService.ts`
- `lib/chem-shastri/chemShastriContextBuilder.ts`
- `lib/chem-shastri/chemShastriResourceRetriever.ts`
- `lib/chem-shastri/chemShastriSafety.ts`
- `app/api/chem-shastri/chat/route.ts`
- `app/api/master-alchem/chat/route.ts`

## Modes

- Explain
- Hint
- Step by step
- Quiz me
- Check my answer
- Exam mode
- Lab guide
- Teacher mode

Teacher mode keeps the same safe chemistry rules but nudges answers toward classroom activity, board explanation, and quick assessment language.

## Compatibility

The old internal `master-alchem` filenames remain as compatibility wrappers. User-facing UI says Chem-Shastri.

## Voice

Voice is manual only. Browser speech can be triggered by the user. Paid TTS remains disabled unless deliberately enabled later.
