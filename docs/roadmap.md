# HTMLxMarkdown Roadmap

## Product Direction

HTMLxMarkdown should grow from a Markdown review MVP into a small, practical toolkit for turning Markdown into readable, editable, and distributable HTML.

The core positioning:

> Markdown is the source of truth. HTML is the human reading, review, and publishing surface.

This means the next product work should stay close to the existing strengths: browser-based local Markdown handling, section-level source editing, and a cleaner rendered HTML surface.

## Five Candidate Directions

1. Build more tools around the HTML and Markdown ecosystem.
2. Convert Markdown to HTML so content can be displayed across different places.
3. Read Markdown on Mac and iOS.
4. Connect with the long-term personal knowledge base product, OpenBrainOS.
5. Add HTML display templates, with future support for personalized customization.

## Priority Judgment

The five directions should not move forward equally at the same time. The strongest near-term path is:

1. **Markdown to HTML publishing**
   - This is closest to the current MVP.
   - It turns the product from a reader/editor into a useful publishing tool.
   - It can be validated quickly with real Markdown files.

2. **HTML display templates**
   - Templates are the clearest product differentiator.
   - They make the output feel designed, shareable, and worth using.
   - The long-term version can support custom themes, brand styles, and personal publishing formats.

3. **HTML and Markdown utility toolkit**
   - This should become the broader product shell after the publishing path is validated.
   - Add tools only when they support the core workflow.

4. **Mac and iOS Markdown reading**
   - This has a real use case, but native clients add product and platform complexity.
   - Validate first with mobile-friendly web reading or a PWA.

5. **OpenBrainOS integration**
   - Keep this as a long-term strategic connection.
   - HTMLxMarkdown should first remain useful as an independent public tool.
   - Later, OpenBrainOS can reuse its rendering, template, and export capabilities.

## Near-Term Roadmap

### v0.2: Markdown to HTML Publisher

Goal: make HTMLxMarkdown useful for turning a Markdown file into a polished HTML page.

- Open or paste Markdown.
- Preview the rendered HTML.
- Select from a batch of fixed visual styles based on the current Top 20 public DESIGN.md entries from `designmd.sh` as of 2026-06-01.
- Switch HTML visual style from a dropdown and update the rendered preview in real time.
- Keep the layout fixed in v0.2; style switching should only change typography, color, borders, radius, code blocks, quotes, and other visual tokens.
- Export a single HTML file.
- Copy rendered HTML.
- Preserve Markdown as the editable source.
- Track key conversion events for validation.

Initial style sources:

- Soul Design MD
- MongoDB Analysis
- Awesome TUI
- Nike Analysis
- SpaceX Inspired
- Wired Inspired
- Design Bites
- Soul Design MD Alt
- Awesome TUI Alt
- Nika Design Skill
- Impeccable
- Awesome Design JP
- VoltAgent Inspired
- BMW M
- Cursor Analysis
- Apple Analysis
- IBM Analysis
- Notion Analysis
- Claude Analysis
- Mistral AI

Out of scope for v0.2:

- User accounts.
- User-owned templates.
- Personalization settings.
- Template marketplace.
- Layout switching.

### v0.3: Template System

Goal: turn templates into a reusable product capability instead of hard-coded styles.

- Extract template configuration for typography, spacing, colors, content width, headings, quotes, code blocks, and cover treatment.
- Add custom CSS support.
- Add a template preview gallery.
- Support per-template export metadata.
- Keep templates portable enough for future OpenBrainOS reuse.

### v0.4: HTML and Markdown Toolkit

Goal: expand around the validated publishing workflow.

- HTML to Markdown conversion.
- Markdown cleanup and formatting.
- Table of contents and anchor generation.
- Code highlighting options.
- Image handling options.
- Platform-specific export presets.

## Deferred Work

Do not prioritize these until the publishing workflow shows clear usage:

- Native Mac app.
- Native iOS app.
- Account system.
- Cloud sync.
- Deep OpenBrainOS binding.
- Large all-in-one Markdown editor scope.

## Product Principle

Build the next version around one clear promise:

> Write and keep Markdown. Publish and review as HTML.

The product should first win by making Markdown output look better, travel better, and stay editable.
