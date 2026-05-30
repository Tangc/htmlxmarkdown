# HTMLxMarkdown

Browser MVP for reading local Markdown as polished HTML while editing source one section at a time.

## Local Development

```bash
npm install
npm run dev
```

Open the local URL in Chrome or Edge. The app uses the File System Access API to open and save local `.md` files directly.

## Feedback Link

Set `VITE_FEEDBACK_URL` to point the toolbar feedback button at your GitHub Issues page:

```bash
VITE_FEEDBACK_URL=https://github.com/your-org/htmlxmarkdown/issues npm run dev
```

## Build

```bash
npm run build
```
