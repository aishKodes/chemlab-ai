# Chem-Shastri Voice Quality Guide

Chemlab currently uses browser `speechSynthesis` only.

## Current behavior

- Voice is manual only. Chem-Shastri never auto-speaks.
- The app prefers better browser voices when available.
- Users can choose a voice, rate, pitch, and volume.
- Spoken text is shortened and cleaned so equations and ions sound less strange.
- Paid text-to-speech remains off by default.

## Best demo setup

Use Chrome or Edge on a system that has Google, Microsoft, Natural, Neural, Premium, Enhanced, `en-IN`, `hi-IN`, Bengali/Bangla, or Odia/Oriya voices installed.

If the browser only exposes basic voices, the UI explains that voice quality depends on browser/device voice availability.

## Why it may still sound robotic

Browser voice quality is controlled by the operating system and browser. Chemlab can choose the best available voice and clean the script, but it cannot create a neural voice without a TTS provider.

## Future option

Local Piper or Indian-language TTS providers can be evaluated later, but they are not enabled in this low-cost demo build.
