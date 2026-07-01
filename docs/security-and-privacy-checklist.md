# Security And Privacy Checklist

## Secrets

- AI keys stay server-side only.
- Never create `NEXT_PUBLIC_AI_API_KEY`, `NEXT_PUBLIC_GEMINI_API_KEY`, or `NEXT_PUBLIC_OPENAI_API_KEY`.
- Hostinger DB and SMTP credentials stay in Hostinger `.env`.

## Auth And Tokens

- Frontend auth currently uses localStorage token storage from Stage 2.
- Future improvement: move to httpOnly cookies once domains and CORS are stable.
- Clear auth on backend `401`.

## Student Data

- Do not send passwords, raw tokens, or private profile notes in analytics.
- Chem-Shastri requests may include class, role, current page, resource slug, and simulation slug.
- Avoid storing sensitive personal data in prompts.

## Chemistry Safety

- Unsafe practical instructions are blocked.
- Allowed: school-level theory, hazards, safe lab supervision guidance.
- Blocked: instructions for harmful chemicals, weapons, drugs, toxic gas release, or unsafe home procedures.

## Admin

- Hostinger Chem-Shastri admin routes require admin role.
- Local Next admin status endpoints expose only masked/safe provider and budget state.
