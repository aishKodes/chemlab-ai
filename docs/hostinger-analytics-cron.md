# Hostinger Analytics Cron

Stage 4 includes a CLI rollup runner:

```bash
php hostinger-backend/scripts/run-analytics-rollups.php
```

Optional date argument:

```bash
php hostinger-backend/scripts/run-analytics-rollups.php 2026-07-01
```

## Hostinger Setup

1. Open Hostinger hPanel.
2. Go to Advanced / Cron Jobs.
3. Add a daily cron after midnight in the server timezone.
4. Use the PHP binary path Hostinger provides.
5. Point it to the uploaded backend script.

Example shape:

```bash
/usr/bin/php /home/USER/domains/api.chemlearning.in/hostinger-backend/scripts/run-analytics-rollups.php
```

Adjust the path to match the actual upload layout.

## What It Computes

- Total events.
- Resource views.
- Simulation starts.
- Per-user daily rows when user IDs exist.
- Mistake, memory, quick drill, and Chem-Shastri counts merged from Stage 4 tables.

The cron does not send emails and does not call paid APIs.
