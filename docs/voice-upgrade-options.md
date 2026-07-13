# Voice Upgrade Options

## 1. Browser speechSynthesis

- Free.
- Works immediately.
- Quality depends on installed browser/system voices.
- Best current choice after voice selection and spoken-text cleanup.

Recommendation now: keep this as the default, manual-only voice path.

## 2. Local Piper

- Free/open local neural TTS.
- Needs a server, local machine, or VPS.
- Not ideal for Vercel-only deployment.
- Possible future option for a controlled live demo machine or Hostinger VPS.

## 3. Bhashini, Sarvam, AI4Bharat-style options

- Potentially better Indian-language voices.
- Must check current access, pricing, usage rights, and production terms before integration.
- Do not hardcode now.

## 4. Paid commercial TTS

- Usually best quality.
- Not appropriate for current low-cost testing.
- Should remain opt-in and budget-guarded if added later.

## Recommendation

Use improved browser voice selection now. For live demos, use Chrome or Edge and choose the best natural Google/Microsoft voice available. Keep voice manual and use short `spokenText`.
