import { chromium } from "@playwright/test";
import { createServer } from "node:net";
import { mkdir, readdir, rm, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(rootDir, "public");
const artifactDir = join(rootDir, "artifacts", "demo-video");
const tempVideoDir = join(artifactDir, "raw");
const outputPath = join(publicDir, "htmlxmarkdown-demo.mp4");
const posterPath = join(publicDir, "htmlxmarkdown-demo-poster.png");
const viewport = { width: 1280, height: 720 };

const wait = (ms) => new Promise((resolveWait) => setTimeout(resolveWait, ms));

async function getAvailablePort() {
  return new Promise((resolvePort, rejectPort) => {
    const server = createServer();
    server.unref();
    server.on("error", rejectPort);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => {
        if (typeof address === "object" && address?.port) {
          resolvePort(address.port);
          return;
        }
        rejectPort(new Error("Could not allocate a local port for Vite."));
      });
    });
  });
}

async function waitForServer(url, timeoutMs = 30_000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Vite is still starting.
    }
    await wait(250);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function runCommand(command, args, options = {}) {
  return new Promise((resolveCommand, rejectCommand) => {
    const child = spawn(command, args, {
      cwd: rootDir,
      stdio: options.stdio ?? "inherit",
      env: { ...process.env, ...options.env }
    });
    child.on("error", rejectCommand);
    child.on("exit", (code) => {
      if (code === 0) {
        resolveCommand();
        return;
      }
      rejectCommand(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

function spawnVite(port) {
  const npxBin = process.platform === "win32" ? "npx.cmd" : "npx";
  return spawn(npxBin, ["vite", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], {
    cwd: rootDir,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, BROWSER: "none" }
  });
}

async function stopVite(processHandle) {
  if (processHandle.exitCode !== null) return;
  processHandle.kill("SIGTERM");
  await Promise.race([
    new Promise((resolveStop) => processHandle.once("exit", resolveStop)),
    wait(3_000).then(() => {
      if (processHandle.exitCode === null) processHandle.kill("SIGKILL");
    })
  ]);
}

async function latestRecordedVideo() {
  const entries = await readdir(tempVideoDir);
  const webmEntries = entries.filter((entry) => entry.endsWith(".webm"));
  if (webmEntries.length === 0) {
    throw new Error("Playwright did not produce a .webm recording.");
  }

  const withTimes = await Promise.all(
    webmEntries.map(async (entry) => {
      const path = join(tempVideoDir, entry);
      const info = await stat(path);
      return { path, mtimeMs: info.mtimeMs };
    })
  );
  return withTimes.sort((a, b) => b.mtimeMs - a.mtimeMs)[0].path;
}

async function injectDemoOverlay(page) {
  await page.addStyleTag({
    content: `
      .demo-caption {
        position: fixed;
        left: 32px;
        bottom: 28px;
        z-index: 9999;
        max-width: 560px;
        padding: 14px 18px;
        border-radius: 8px;
        background: rgba(17, 24, 39, 0.92);
        color: white;
        font: 600 18px/1.35 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        box-shadow: 0 18px 40px rgba(0, 0, 0, 0.28);
      }
    `
  });
  await page.evaluate(() => {
    const caption = document.createElement("div");
    caption.className = "demo-caption";
    caption.textContent = "HTMLxMarkdown demo";
    document.body.appendChild(caption);
  });
}

async function setDemoCaption(page, text, pauseMs = 900) {
  await page.evaluate((nextText) => {
    const caption = document.querySelector(".demo-caption");
    if (caption) caption.textContent = nextText;
  }, text);
  await wait(pauseMs);
}

async function recordDemo(baseUrl) {
  await rm(tempVideoDir, { recursive: true, force: true });
  await mkdir(tempVideoDir, { recursive: true });
  await mkdir(publicDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport,
    recordVideo: { dir: tempVideoDir, size: viewport }
  });
  await context.addInitScript(() => {
    window.localStorage.setItem("htmlxmarkdown.guideSeen.v1", "true");
  });

  const page = await context.newPage();
  try {
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await injectDemoOverlay(page);

    await setDemoCaption(page, "Start from the empty editor.", 5_000);
    await page.getByRole("button", { name: "Test sample" }).click();
    await page.getByRole("heading", { name: "Magazine Web Ppt" }).waitFor();
    await setDemoCaption(page, "Open the bundled complex Markdown skill sample.", 8_000);

    await page.screenshot({ path: posterPath });

    await page.locator(".toc-item").filter({ hasText: "Step 2 · 拷贝模板" }).click();
    await page.getByLabel("Section Markdown source").waitFor();
    await setDemoCaption(page, "Jump to a section from the table of contents.", 8_000);

    const replacement = [
      "### Step 2 · 拷贝模板",
      "",
      "从模板开始创建可运行的单文件网页 PPT。",
      "",
      "Demo edit: HTMLxMarkdown preserves the rest of the Markdown source.",
      ""
    ].join("\n");
    const textarea = page.getByLabel("Section Markdown source");
    await textarea.click();
    await page.keyboard.press(process.platform === "darwin" ? "Meta+A" : "Control+A");
    await setDemoCaption(page, "Edit only this block's Markdown source.", 4_000);
    await page.keyboard.type(replacement, { delay: 7 });
    await setDemoCaption(page, "The editor keeps the change scoped to the selected block.", 6_000);

    await page.getByRole("button", { name: "Apply section edit" }).click();
    await page.getByText("Demo edit: HTMLxMarkdown preserves the rest of the Markdown source.").waitFor();
    await setDemoCaption(page, "Apply the section edit and review the rendered result.", 10_000);

    await page.getByRole("button", { name: "Reset" }).click();
    await page.getByRole("heading", { name: "Open a local Markdown file" }).waitFor();
    await setDemoCaption(page, "Reset returns to the unopened state.", 8_000);
    await wait(4_000);
  } finally {
    await context.close();
    await browser.close();
  }
}

async function convertToMp4(webmPath) {
  await runCommand("ffmpeg", [
    "-y",
    "-i",
    webmPath,
    "-vf",
    "fps=24,scale=960:-2",
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "28",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    outputPath
  ]);
}

async function main() {
  const port = await getAvailablePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const vite = spawnVite(port);
  let viteOutput = "";

  vite.stdout.on("data", (chunk) => {
    viteOutput += chunk.toString();
  });
  vite.stderr.on("data", (chunk) => {
    viteOutput += chunk.toString();
  });

  try {
    await waitForServer(baseUrl);
    await recordDemo(baseUrl);
    const webmPath = await latestRecordedVideo();
    await convertToMp4(webmPath);
    const outputInfo = await stat(outputPath);
    const posterInfo = await stat(posterPath);
    console.log(`Demo video: ${outputPath} (${Math.round(outputInfo.size / 1024)} KB)`);
    console.log(`Demo poster: ${posterPath} (${Math.round(posterInfo.size / 1024)} KB)`);
  } catch (error) {
    if (viteOutput.trim()) {
      console.error(viteOutput.trim());
    }
    throw error;
  } finally {
    await stopVite(vite);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
