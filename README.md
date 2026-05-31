# HTMLxMarkdown

Browser MVP for reading local Markdown as polished HTML while editing source one section at a time.

## Try It

- App: https://htmlxmarkdown.com/
- Shareable demo: https://htmlxmarkdown.com/?demo=1
- Demo video: https://htmlxmarkdown.com/htmlxmarkdown-demo.mp4

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
