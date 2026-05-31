# HTML Is for Humans, Markdown Is for Agents

Markdown works because it is plain, portable, and easy for tools to transform. It is good source material for agents, scripts, version control, search, review diffs, and publishing pipelines.

HTML works because it is easier for people to inspect. A rendered document makes hierarchy, spacing, tables, code blocks, links, and broken structure visible faster than raw text.

The mistake is treating one format as if it should do both jobs equally well.

In agent-assisted work, Markdown should usually remain the source of truth. It is the file an agent can read, patch, test, commit, and hand to another tool. It keeps the workflow explicit.

HTML should be the supervision surface. It helps a person review the result, notice whether the structure reads correctly, and decide which section needs editing.

HTMLxMarkdown is built around that division:

- Keep Markdown as the durable operating format.
- Use HTML for human reading and supervision.
- Edit one section at a time without losing the original source.

That keeps the workflow boring in the useful way: agents and tools get predictable Markdown, while humans get a better place to read and review it.
