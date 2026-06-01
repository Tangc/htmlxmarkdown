# HTMLxMarkdown Launch Post

## 中文

我做了一个小工具，已经发布上线。
https://htmlxmarkdown.com

它解决的是当人需要阅读和修改复杂超长Markdown时，因为Markdown原文格式不易读导致的难以修改，不容易改对的问题。

思路源自 claudecode 员工提出的 HTML is new Markdown 的话题，但我认为他们不是替换关系。

Markdown 适合给 Agent、脚本、版本控制和各种工具继续处理，但人类在审阅长文档时，需要一个直观易操作的 HTML 阅读界面。

所以 HTMLxMarkdown 不尝试替代 Markdown。它把两件事分开：

Markdown 仍然是源头。
HTML 负责给人阅读、检查和监督。
修改时保存回原始 Markdown。
适合用来审阅 AI 生成的 README、Prompt、策略文档、Skill 文件、产品说明，或者任何不想被富文本编辑器改乱的 Markdown。

可以直接尝试 demo：
https://htmlxmarkdown.com/?demo=1

这是一个 MVP 版本。如果你有相关的真实场景，问题，需求，想法，欢迎直接找我聊～

https://github.com/Tangc/htmlxmarkdown/issues/new?template=feedback.yml

## English

I built a small tool called HTMLxMarkdown.

The idea is simple: Markdown should remain the source of truth for agents, scripts, version control, and downstream tools. HTML should be the human supervision layer.

HTMLxMarkdown keeps that split clear:

- Markdown remains the source of truth.
- HTML gives humans a cleaner reading and review surface.
- Edits go back into the original Markdown, section by section.

It is useful when reviewing AI-generated READMEs, prompts, policy docs, skill files, product notes, or any Markdown document you do not want a rich-text editor to reshape.

Try the demo:

https://htmlxmarkdown.com/?demo=1

This is a practical MVP. If it fits, breaks, or misses something in your workflow, feedback is welcome:

https://github.com/Tangc/htmlxmarkdown/issues/new?template=feedback.yml
