# AI Cost Control Guide

Chem-Shastri is designed for low-cost testing first.

## Routing Strategy

1. Direct local answer for common chemistry questions.
2. FAQ/cache/resource retrieval before provider calls.
3. Gemini for normal explanations.
4. OpenAI only for hard reasoning if fallback is enabled.
5. Mock/local fallback when keys are missing.

## Recommended Testing Env

```bash
CHEM_SHASTRI_DEFAULT_PROVIDER=gemini
CHEM_SHASTRI_FAST_PROVIDER=gemini
CHEM_SHASTRI_REASONING_PROVIDER=openai
CHEM_SHASTRI_OPENAI_FALLBACK_ENABLED=false
CHEM_SHASTRI_DAILY_BUDGET_INR=50
CHEM_SHASTRI_RETRIEVAL_ENABLED=true
CHEM_SHASTRI_KEYWORD_SEARCH=true
AI_COST_GUARD_ENABLED=true
STOP_AI_WHEN_BUDGET_EXCEEDED=true
```

## Admin Monitoring

Use `/admin/chem-shastri` to inspect:

- provider configured status
- daily budget used and remaining
- cache and RAG-only counters
- safety mode
- retrieval test results
- recent AI events when Hostinger is connected

## Voice

Browser voice is manual and free. Paid voice remains off:

```bash
VOICE_AUTO_SPEAK=false
PAID_TTS_ENABLED=false
CHEM_SHASTRI_VOICE_AUTO_SPEAK=false
```
