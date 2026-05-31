# HTMLxMarkdown Launch Post

## 中文

我做了一个小工具：HTMLxMarkdown。

它解决的是一个很具体的问题：Markdown 适合给 Agent、脚本、版本控制和各种工具继续处理，但人类在审阅长文档时，更需要一个干净的 HTML 阅读界面。

所以 HTMLxMarkdown 不尝试替代 Markdown。它把两件事分开：

- Markdown 仍然是 source of truth。
- HTML 负责给人阅读、检查和监督。
- 修改时回到原始 Markdown，并按段落保存。

适合用来审阅 AI 生成的 README、Prompt、策略文档、Skill 文件、产品说明，或者任何不想被富文本编辑器改乱的 Markdown。

可以直接试 demo：

https://htmlxmarkdown.com/?demo=1

这是一个很薄的 MVP。如果你在真实工作流里遇到卡点，欢迎直接反馈：

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
