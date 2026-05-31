# HTMLxMarkdown

Read Markdown as polished HTML, then edit the original Markdown section by section.

[Try the app](https://htmlxmarkdown.com/) | [Open the demo](https://htmlxmarkdown.com/?demo=1) | [Watch the demo video](https://htmlxmarkdown.com/htmlxmarkdown-demo.mp4) | [Send feedback](https://github.com/Tangc/htmlxmarkdown/issues/new?template=feedback.yml)

HTMLxMarkdown is a browser MVP for people who want Markdown to stay the source of truth, while giving humans a cleaner HTML reading and review surface.

## Why

Markdown is still the most practical format for agents, scripts, version control, and long-lived source files. HTML is better when a person needs to inspect structure, catch formatting issues, and supervise a document before it moves on.

HTMLxMarkdown keeps those jobs separate:

- **Markdown remains the source of truth.** Open a local `.md` file, edit the source, and save it back.
- **HTML becomes the human review layer.** Read the rendered document, jump into one section, then return to the full page.
- **Agents and tools keep a stable input.** The output you trust is still Markdown, not a copied rich-text artifact.

## Key Use Cases

- Review AI-generated Markdown before publishing, committing, or sending it to another tool.
- Clean up long README, prompt, policy, or skill files without losing the source format.
- Inspect complex Markdown with tables, code blocks, headings, links, and nested lists.
- Use one local file as the shared artifact between a human reviewer and agent workflows.

## Local Files and Trust

HTMLxMarkdown runs in the browser and uses the File System Access API in supported Chromium browsers. The app opens and saves local `.md` files directly after you choose them. It does not require an account for the public demo or local development flow.

For sensitive files, review the code, run it locally, and open files only from a browser you trust.

## Demo

- Public app: [https://htmlxmarkdown.com/](https://htmlxmarkdown.com/)
- Shareable demo with bundled sample: [https://htmlxmarkdown.com/?demo=1](https://htmlxmarkdown.com/?demo=1)
- Demo video: [https://htmlxmarkdown.com/htmlxmarkdown-demo.mp4](https://htmlxmarkdown.com/htmlxmarkdown-demo.mp4)

## HTML Is for Humans, Markdown Is for Agents

The short version: HTML is a supervision surface; Markdown is an operating format.

People need layout, hierarchy, and visual scanning to catch whether a document reads correctly. Agents and tools need plain text with predictable structure. HTMLxMarkdown is built around that split instead of trying to replace Markdown with another editor format.

Read the short-form note: [HTML is for humans, Markdown is for agents](docs/html-is-for-humans-markdown-is-for-agents.md).

## Local Development

```bash
npm install
npm run dev
```

Open the local URL in Chrome or Edge. The app uses the File System Access API to open and save local `.md` files directly.

To point the toolbar feedback button at a GitHub Issues page:

```bash
VITE_FEEDBACK_URL='https://github.com/Tangc/htmlxmarkdown/issues/new?template=feedback.yml' npm run dev
```

## Build

```bash
npm run build
```

## Demo Video

Generate the public demo video and poster:

```bash
npm run demo:video
```

The script records Chromium through the bundled complex Markdown sample, a block edit, and reset flow.

## Search Console and Analytics

Submit this sitemap in Google Search Console:

```text
https://htmlxmarkdown.com/sitemap.xml
```

Google Analytics is disabled unless a measurement ID is configured:

```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX npm run build
```

For Vercel, add `VITE_GA_MEASUREMENT_ID` as a Production environment variable, then redeploy.
