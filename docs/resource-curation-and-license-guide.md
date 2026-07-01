# Resource Curation And License Guide

Chemlab can now store safer metadata for original, external, and curated learning resources.

## New Resource Fields

- `source_url`
- `license_type`
- `attribution_text`
- `author`
- `embed_url`
- `external_open_mode`
- `quality_status`
- `accuracy_reviewed_by`
- `accuracy_reviewed_at`
- `accuracy_notes`
- `why_useful`
- `student_instructions`
- `student_level`
- `estimated_minutes`

## Publishing Rule

For external resources, videos, and visualizations, publishing requires:

- source URL
- license type
- attribution text

This prevents accidental unattributed public resources.

## Student Resource Pages

`/resources/{slug}` displays:

- source reference
- author
- license
- attribution
- student instructions
- why the resource helps
- estimated minutes
- review status

## Admin Workflow

1. Add or edit a resource in `/admin/resources`.
2. Fill source and license fields when the resource is external.
3. Add student instructions and usefulness notes.
4. Set quality status after review.
5. Publish only when metadata is complete.
