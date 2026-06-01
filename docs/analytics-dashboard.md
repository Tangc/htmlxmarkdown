# HTMLxMarkdown Analytics Dashboard

This dashboard is for the first Chinese-user growth loop. The goal is to see whether visitors can understand the product, try the demo, edit a section, and leave feedback.

## Primary Funnel

Create a GA4 Funnel exploration with these steps:

1. `page_view`
2. `demo_opened`
3. `edit_section_clicked`
4. `apply_section_edit`
5. `feedback_clicked`

Recommended settings:

- Segment: users where language or region indicates Chinese-speaking traffic.
- Page filter: include `/` and `/?demo=1`.
- Breakdown: `session_source / session_medium`.
- Time range: first 48 hours after each launch push, then trailing 7 days.

## Secondary Events

Use these events to understand where users drop off:

- `open_file_clicked`: intent to use a real local Markdown file.
- `open_file_succeeded`: local file flow works.
- `save_file_succeeded`: highest-intent real workflow completion.
- `save_as_file_succeeded`: user trusts the app enough to export.
- `share_clicked`: user clicked the demo share button.
- `share_succeeded`: demo link was shared or copied.
- `design_style_changed`: user tried HTML visual styles.
- `usage_guide_opened`: user needed onboarding help.
- `reset_document`: user returned to the unopened state.

## Suggested GA4 Cards

- Active users by source and medium.
- Views for `/` vs `/?demo=1`.
- Funnel completion rate for the primary funnel.
- Event count for `demo_opened`, `edit_section_clicked`, `apply_section_edit`, `feedback_clicked`.
- Top countries, regions, and browser languages.
- Retention by returning users over 7 days.

## 48-Hour Review Questions

- Which channel sent the most qualified demo users?
- How many users reached `apply_section_edit`?
- Did any users complete `save_file_succeeded` with a real file?
- Which step has the biggest drop-off?
- Did feedback issues mention confusion, trust, browser support, or missing export/template needs?
- Which Chinese launch copy or channel should be doubled down next?
