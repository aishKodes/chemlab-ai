# Simulation Known Issues

This document records accepted simulation follow-ups that should not block Stage 6 launch readiness.

## Redox Transfer Kitchen Image Optimization Warnings

`npm run lint` may report `@next/next/no-img-element` warnings in Redox Transfer Kitchen components.

Current decision:

- The Redox story and game scenes use generated cinematic assets with layout-sensitive sizing.
- The tags are warnings only, not build errors.
- They are documented for a future optimization pass instead of being changed during Stage 6 production hardening.

Future fix:

- Convert the stable scene assets to `next/image`.
- Add explicit width/height metadata from the asset manifest.
- Re-test mobile scene layout, story frame readability, and game control safe zones.

## Simulation Scope Boundary

Stage 6 does not rewrite Redox Transfer Kitchen or Hydrocarbon Naming Quest. The goal is production readiness, docs, env templates, backend integration checks, and safe launch guardrails.
