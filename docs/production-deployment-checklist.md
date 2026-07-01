# Production Deployment Checklist

## Vercel Frontend

- Set `NEXT_PUBLIC_BACKEND_URL=https://api.chemlearning.in`.
- Set `BACKEND_INTERNAL_API_URL=https://api.chemlearning.in`.
- Add `GEMINI_API_KEY` only in server environment variables.
- Add `OPENAI_API_KEY` only if fallback or hard reasoning is intentionally enabled.
- Do not add any `NEXT_PUBLIC_*` AI key.
- Keep `CHEM_SHASTRI_DEFAULT_PROVIDER=gemini`.
- Keep `CHEM_SHASTRI_OPENAI_FALLBACK_ENABLED=false` until budget is reviewed.

## Hostinger Backend

- Run migrations and seeders.
- Confirm `/api/health`.
- Confirm admin token can access `/api/admin/chem-shastri/summary`.
- Confirm learning logs accept `/api/learning/chem-shastri/question-log`.
- Confirm SMTP errors are logged without exposing passwords.

## Safety

- Keep `CHEM_SHASTRI_SAFETY_MODE=strict`.
- Keep `CHEM_SHASTRI_ALLOW_UNSAFE_CHEMISTRY_INSTRUCTIONS=false`.
- Verify unsafe chemistry prompts get theory-only responses.

## Cost

- Keep `CHEM_SHASTRI_DAILY_BUDGET_INR=50` for testing.
- Keep cache and keyword retrieval enabled.
- Monitor admin Chem-Shastri budget cards after launch.

## Final Commands

```bash
npm run lint
npm run build
```
