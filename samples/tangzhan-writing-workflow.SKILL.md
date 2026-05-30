---
name: tangzhan-writing-workflow
description: Use when turning a source article, URL, thread, transcript, note, or Markdown file into a Tangzhan-style Chinese technical share or publishing asset package, especially for AI programming, Agent, Codex, ClaudeCode, tooling, workflow, developer trends, PNG infographics, WeChat covers, or Xiaohongshu/Rednote cards.
---

# Tangzhan Writing Workflow

## Overview

Transform source material into a publishable Tangzhan-style technical share through a reproducible pipeline: source validation, structured extraction, Tangzhan judgment, article shaping, PNG infographics, WeChat cover generation, Xiaohongshu card generation, and quality gates.

Do not treat this as a prompt-writing task. Treat it as an editorial production workflow with explicit intermediate artifacts and failure handling.

## Workflow

### 1. Source Intake

Accept one or more of:

- URL
- local Markdown/text file
- pasted article/thread
- transcript
- rough note

First produce a source status:

```text
source_status: success | partial | failed
source_type: url | file | paste | transcript | note
source_path_or_url: ...
failure_reason: ...
```

If source extraction fails, stop and ask for the missing source text or permission to use an authenticated/browser-based retrieval path. Never invent source content.

### 2. Source Structuring

Convert the source into a neutral structured brief before adding Tangzhan's opinion.

Required fields:

```text
one_sentence_summary:
key_claims:
important_examples:
technical_terms:
actionable_points:
controversial_points:
missing_context:
```

Keep this stage descriptive. Do not write the final article yet.

### 3. Tangzhan Judgment Layer

Answer these questions explicitly:

```text
1. 这件事对程序员有什么影响？
2. 这件事对 AI 编程 / Agent 实践有什么影响？
3. 它是工具变化、流程变化、认知变化，还是商业变化？
4. 普通开发者现在能不能用？
5. 坑在哪里？
6. 我会不会推荐，推荐给谁？
```

Then produce:

```text
tangzhan_angle:
position: 推荐 | 谨慎推荐 | 观望 | 不推荐
reasoning_chain:
reader_value:
risk_points:
next_action:
```

This layer is the core value. If it only summarizes the source, redo this step.

### 4. Article Type Selection

Choose one primary type:

- **AI见闻型**: news, releases, posts, links. Structure: 是什么 -> 我的判断 -> 影响 -> 值不值得跟。
- **工具体验型**: tools, models, features. Structure: 背景 -> 怎么用 -> 体验 -> 优缺点 -> 推荐人群。
- **教程避坑型**: setup, config, quota, errors. Structure: 问题 -> 原因 -> 方案1 -> 方案2 -> 应急方案 -> 总结。
- **认知判断型**: trends, methods, industry changes. Structure: 反直觉判断 -> 现象 -> 本质 -> 路径 -> 我的选择。
- **体系沉淀型**: long-term themes such as Agent, Skills, context engineering. Structure: 定义 -> 分层 -> 案例 -> 实践路径 -> 后续体系。

Output:

```text
article_type:
recommended_title:
title_candidates:
core_thesis:
```

### 5. Outline Before Draft

Write a compact outline before final prose.

Default daily-share outline:

```text
# 标题

大家好，我是唐斩，这是第X天第Y篇分享。

## 背景
## 核心判断
## 拆解
## 实践建议
## 总结
```

Use the user's real numbering only if provided. If unknown, either omit the day/article number or mark it for user fill-in; do not fabricate unless the user explicitly asks for a placeholder.

### 6. Tangzhan Style Rendering

Render in Chinese unless the user requests otherwise.

Style rules:

- Use first-person judgment: `我认为`、`我觉得`、`我用下来`、`我的观点是`。
- Start with a concrete event, tool, source, or problem.
- Give a clear position early.
- Prefer numbered sections, stages, methods, and problems.
- Connect tool facts to developer action: 适合谁、不适合谁、怎么做、坑在哪里。
- Use technical/business vocabulary naturally: `Agent`、`AI编程`、`工作流`、`上下文工程`、`MCP`、`Skill`、`验证器`、`红利`、`复利`、`闭环`。
- Allow light colloquial phrasing and parentheses, but keep the article useful.
- Avoid generic AI marketing prose, inflated claims, and unsupported facts.

### 7. PNG Infographic Version

Run this step by default when using this skill to process a source into a final article, unless the user explicitly asks for text-only output or says not to generate images. This is also required when the user asks for 配图、信息图、图片版、PNG 图片、封面图, or says the article should include visuals for quick reader understanding.

Do not use Mermaid or SVG for this branch unless the user asks for editable diagrams. Generate raster PNG infographics with the image generation tool.

Process:

1. Select 3-5 visual points from the final article. Prefer:
   - the core thesis / cover image
   - major conceptual distinctions
   - workflow loops
   - comparison tables
   - reader action frameworks
2. For each image, write a compact image brief:

```text
image_index:
section:
title_text:
key_labels:
layout:
style:
```

3. Generate each image as a clean Chinese tech infographic:
   - 16:9 aspect ratio
   - white or very light background
   - blue/slate/green accents
   - flat information design
   - large readable Chinese text
   - no 3D, no decorative blobs, no heavy gradients
   - text must be minimal and important; avoid dense paragraphs inside images
4. Copy generated PNGs into the workspace, under a descriptive asset directory such as:

```text
assets/<source-slug>-gpt-images/
```

Keep the original generated images in place. Copy them; do not move or delete them.

5. Name copied files in reading order:

```text
01-cover-or-core-thesis.png
02-<section>.png
03-<section>.png
```

6. Create a new Markdown version rather than overwriting the text-only version, for example:

```text
<source-slug>-tangzhan-gpt-image.md
```

7. Insert each image immediately before the section it helps explain:

```markdown
![简短说明](</absolute/path/to/image.png>)
```

Use absolute paths in Markdown image tags.

8. Verify:
   - every referenced image exists
   - image files are PNG
   - dimensions are reasonable for article use
   - number of images is适量, normally 3-5
   - image text is readable enough from preview

If image text has obvious wrong terms, regenerate that image once with stricter text instructions.

### 8. Social Publishing Assets

Run this step by default after Step 7 when the user asks this skill to process a source into a reusable article package. Skip only when the user explicitly says:

- `只要文章`
- `不要配图`
- `不要公众号封面`
- `不要小红书`
- `text-only`

Use `guizang-social-card-skill` for this stage. Read its `SKILL.md` and the minimum needed references before building assets:

- `references/platform-specs.md`
- `references/theme-presets.md`
- `references/layout-recipes.md`
- `references/portrait-fill.md` for Xiaohongshu
- `references/title-shortener.md` for WeChat 1:1 title shortening
- `references/qa-checklist.md` before final delivery

If `guizang-social-card-skill` is installed but not auto-discovered in the current Codex session, read it directly from:

```text
~/.codex/skills/guizang-social-card-skill/SKILL.md
```

If the skill is missing, tell the user and continue with the article + PNG infographic outputs rather than inventing a weaker social-card workflow.

#### 8.1 Inputs To Pass Forward

Use the illustrated Markdown article from Step 7 as the source of truth for social assets.

Pass these materials into `guizang-social-card-skill`:

```text
article_markdown_path:
source_url_or_path:
recommended_title:
core_thesis:
tangzhan_angle:
reader_action:
png_infographic_asset_dir:
png_infographic_files:
preferred_style:
```

Use existing Step 7 PNG infographics as the evidence layer where useful. Do not silently discard them and make empty typographic cards unless the social-card layout genuinely works better without images.

#### 8.2 WeChat Official Account Cover Pair

Always create a WeChat cover package unless skipped by the user.

Default output folder:

```text
wechat-<source-slug>-cover/
```

Required files:

```text
wechat-<source-slug>-cover/index.html
wechat-<source-slug>-cover/render.cjs
wechat-<source-slug>-cover/output/wechat-21x9-cover.png
wechat-<source-slug>-cover/output/wechat-1x1-cover.png
wechat-<source-slug>-cover/output/wechat-cover-pair-preview.png
```

Requirements:

- Use `guizang-social-card-skill`'s WeChat pair workflow.
- Build `21:9` and `1:1` in the same HTML file.
- Include a pair-preview section for checking visual relationship.
- `21:9` uses full or near-full article title, short subtitle, and one strong visual relation.
- `1:1` uses a shortened title derived via `title-shortener.md`; do not crop the `21:9` cover.
- Default style for Tangzhan technical shares: Swiss International with IKB Blue, unless the user specifies electronic magazine/editorial style.
- Render PNG, verify dimensions:
  - `wechat-21x9-cover.png`: `2100 x 900`
  - `wechat-1x1-cover.png`: `1080 x 1080`
  - pair preview can be larger, but must not crop either cover.

#### 8.3 Xiaohongshu / Rednote Carousel

Always create a Xiaohongshu package unless skipped by the user.

Default output folder:

```text
xhs-<source-slug>-magazine/
```

Required files:

```text
xhs-<source-slug>-magazine/index.html
xhs-<source-slug>-magazine/render.cjs
xhs-<source-slug>-magazine/output/xhs-01-cover.png
xhs-<source-slug>-magazine/output/xhs-02-<topic>.png
...
```

Requirements:

- Use `guizang-social-card-skill`'s Rednote workflow.
- Generate 5-9 pages for most Tangzhan technical shares:
  - Page 1: cover hook
  - Page 2: core judgment
  - Middle pages: one idea per workflow, comparison, example, or risk
  - Last page: action checklist or closing thesis
- Default style for Tangzhan technical shares: Editorial Magazine x E-ink, normally `indigo-porcelain` for AI/tooling topics.
- Use Step 7 PNG infographics as evidence images on 2-4 pages when they improve comprehension.
- Each page must be `1080 x 1440`.
- Keep the social cards compressed: do not paste long article paragraphs into the images.

#### 8.4 Rendering And Validation

For both WeChat and Xiaohongshu packages:

1. Start from the seed templates inside `guizang-social-card-skill`; do not write blank HTML from scratch.
2. Render with Playwright or the local browser screenshot path used by the skill.
3. Verify dimensions with a real image inspection command.
4. Open/render-preview the images before claiming completion.
5. Run the social deck validator when available:

```bash
node ~/.codex/skills/guizang-social-card-skill/validate-social-deck.mjs <task-dir> --style=editorial
node ~/.codex/skills/guizang-social-card-skill/validate-social-deck.mjs <task-dir> --style=swiss
```

Use the matching style flag. If the validator is unavailable because dependencies are missing, say so and still do manual QA with `qa-checklist.md`.

#### 8.5 Final Package Summary

When this stage runs, final delivery must include:

```text
article_markdown:
png_infographic_asset_dir:
wechat_cover_dir:
wechat_outputs:
xhs_carousel_dir:
xhs_outputs:
verification:
```

Show the key generated images inline when the environment supports local image rendering:

- WeChat `21:9`
- WeChat `1:1`
- Xiaohongshu cover
- optionally the first 2-3 Xiaohongshu content pages

Use absolute filesystem paths in Markdown image tags.

### 9. Quality Gate

Before final delivery or file save, check:

```text
has_clear_position:
has_source_context:
has_tangzhan_judgment:
has_reader_action:
has_risk_or_limit:
no_fake_source:
not_generic_ai_style:
matches_article_type:
if_visual_version_images_exist:
if_visual_version_uses_png:
if_wechat_requested_or_default_cover_pair_exists:
if_xhs_requested_or_default_carousel_exists:
if_social_assets_verified:
```

If any item fails, revise the corresponding workflow stage:

- Missing source facts -> Step 2
- No opinion -> Step 3
- Wrong structure -> Step 4 or 5
- Generic voice -> Step 6
- Unsupported claims -> Step 2 and 6
- Missing or bad image references -> Step 7
- Missing or bad social cards -> Step 8

## Output Formats

When the user asks for the full workflow result, include:

```text
## 工作流结果
source_status:
article_type:
core_thesis:
position:
reader_action:

---

# 成文稿
...
```

When the user asks only for the article, output just the final article.

When the user asks to save the result, write a Markdown file containing the workflow result and final article. Use a descriptive filename based on the source, for example `best-codex-tangzhan-output.md`, unless the user specifies a path.

By default, write the PNG illustrated article Markdown, copied image assets, WeChat cover package, and Xiaohongshu carousel package into the workspace. If a text-only article is also useful, save it as a secondary artifact. Return all package paths and the key output PNG paths.

## Common Mistakes

- Do not turn the workflow into a single prompt.
- Do not summarize without adding Tangzhan's judgment.
- Do not fabricate inaccessible URL content.
- Do not skip the outline for long or ambiguous sources.
- Do not over-polish into corporate WeChat style; preserve direct technical judgment.
- Do not publish source-derived claims that were not present in the source or independently verified.
- Do not use SVG or Mermaid when the user explicitly asks for generated PNG images.
- Do not leave generated PNGs only in the transient generated-images folder; copy them into the workspace asset directory and reference the copied paths.
- Do not skip PNG generation during this skill's normal article workflow unless the user explicitly requests text-only output.
- Do not stop after PNG infographics when the user expected a full publishing package.
- Do not create WeChat or Xiaohongshu images with ad hoc CSS if `guizang-social-card-skill` is available.
- Do not treat Xiaohongshu cards as screenshots of the article; rewrite each page into one visual argument.
