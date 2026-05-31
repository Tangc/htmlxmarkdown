export type Language = "en" | "zh-CN";

type DynamicCopy = {
  opened: (fileName: string) => string;
  saved: (fileName: string) => string;
  editSection: (title: string) => string;
};

export type Copy = DynamicCopy & {
  applySectionEdit: string;
  cancel: string;
  closeEditor: string;
  closeGuide: string;
  couldNotOpenFile: string;
  couldNotSaveFile: string;
  documentSections: string;
  edit: string;
  editing: string;
  demoVideo: string;
  editorPlaceholder: string;
  feedback: string;
  fileAccessDescription: string;
  fileAccessTitle: string;
  gotIt: string;
  guideBody: string;
  guideContext: string;
  guideDetail: string;
  guideSource: string;
  guideTitle: string;
  language: string;
  languageEnglish: string;
  languageSimplifiedChinese: string;
  localFileTrustNote: string;
  noFileOpen: string;
  open: string;
  openCancelled: string;
  openFilePrompt: string;
  openLocalDescription: string;
  openLocalTitle: string;
  openingFile: string;
  ready: string;
  renderedMarkdown: string;
  reset: string;
  save: string;
  saveAs: string;
  saveCancelled: string;
  saving: string;
  savingCopy: string;
  sectionApplied: string;
  sectionEditCancelled: string;
  sectionEditor: string;
  sectionMarkdownSource: string;
  sections: string;
  testSample: string;
  unsavedChanges: string;
  usage: string;
};

export const copies: Record<Language, Copy> = {
  en: {
    applySectionEdit: "Apply section edit",
    cancel: "Cancel",
    closeEditor: "Close editor",
    closeGuide: "Close guide",
    couldNotOpenFile: "Could not open file",
    couldNotSaveFile: "Could not save file",
    documentSections: "Document sections",
    edit: "Edit",
    editing: "Editing",
    demoVideo: "Demo video",
    editorPlaceholder: "Select a section to edit its Markdown source.",
    feedback: "Feedback",
    fileAccessDescription:
      "HTMLxMarkdown saves directly back to local Markdown files, which currently requires Chrome or Edge with the File System Access API.",
    fileAccessTitle: "Chromium file access required",
    gotIt: "Got it",
    guideBody:
      "Open a Markdown file, read it as structured HTML, click any section to edit its original Markdown source, then save back to the file.",
    guideContext:
      "Inspired by Anthropic Claude Code engineer Thariq Shihipar's “HTML is the new Markdown” idea: HTML can be the human-facing layer for richer reading and supervision, while Markdown remains the durable source file that agents and tools can edit.",
    guideDetail:
      "Use Test sample to try a complex Markdown document without selecting a local file. Use Reset to return to the unopened state.",
    guideSource: "Background: HTML is the new Markdown",
    guideTitle: "How to use HTMLxMarkdown",
    language: "Language",
    languageEnglish: "English",
    languageSimplifiedChinese: "简体中文",
    localFileTrustNote: "Local files stay in your browser. HTMLxMarkdown does not upload them to a backend.",
    noFileOpen: "No file open",
    open: "Open",
    openCancelled: "Open cancelled",
    openFilePrompt: "Open a Markdown file to inspect its structure.",
    openLocalDescription:
      "Read it as structured HTML, edit one source section at a time, and save the Markdown back unchanged outside your edits.",
    openLocalTitle: "Open a local Markdown file",
    openingFile: "Opening file...",
    ready: "Ready",
    renderedMarkdown: "Rendered Markdown",
    reset: "Reset",
    save: "Save",
    saveAs: "Save As",
    saveCancelled: "Save cancelled",
    saving: "Saving...",
    savingCopy: "Saving copy...",
    sectionApplied: "Section applied",
    sectionEditCancelled: "Section edit cancelled",
    sectionEditor: "Section editor",
    sectionMarkdownSource: "Section Markdown source",
    sections: "Sections",
    testSample: "Test sample",
    unsavedChanges: "Unsaved changes",
    usage: "Usage",
    opened: (fileName) => `Opened ${fileName}`,
    saved: (fileName) => `Saved ${fileName}`,
    editSection: (title) => `Edit section ${title}`
  },
  "zh-CN": {
    applySectionEdit: "应用章节修改",
    cancel: "取消",
    closeEditor: "关闭编辑器",
    closeGuide: "关闭使用说明",
    couldNotOpenFile: "无法打开文件",
    couldNotSaveFile: "无法保存文件",
    documentSections: "文档章节",
    edit: "编辑",
    editing: "正在编辑",
    demoVideo: "演示视频",
    editorPlaceholder: "选择一个章节来编辑它的 Markdown 源文。",
    feedback: "反馈",
    fileAccessDescription:
      "HTMLxMarkdown 会直接保存回本地 Markdown 文件，目前需要 Chrome 或 Edge 支持 File System Access API。",
    fileAccessTitle: "需要 Chromium 文件访问能力",
    gotIt: "知道了",
    guideBody: "打开一个 Markdown 文件，用结构化 HTML 阅读，点击任意章节编辑原始 Markdown 源文，然后保存回文件。",
    guideContext:
      "这个工具受 Anthropic Claude Code 工程师 Thariq Shihipar 提出的 “HTML is the new Markdown” 启发：HTML 更适合作为人阅读和监督的界面，Markdown 继续作为可保存、可 diff、可被 agent 和工具修改的源文件。",
    guideDetail: "可以用“测试样例”直接体验复杂 Markdown，不需要选择本地文件。用“恢复初始状态”回到未打开状态。",
    guideSource: "背景：HTML is the new Markdown",
    guideTitle: "如何使用 HTMLxMarkdown",
    language: "语言",
    languageEnglish: "English",
    languageSimplifiedChinese: "简体中文",
    localFileTrustNote: "本地文件只会留在浏览器里，HTMLxMarkdown 不会上传到后端。",
    noFileOpen: "未打开文件",
    open: "打开",
    openCancelled: "已取消打开",
    openFilePrompt: "打开一个 Markdown 文件以查看它的结构。",
    openLocalDescription: "用结构化 HTML 阅读，按章节编辑源 Markdown，并且只把你修改过的内容保存回文件。",
    openLocalTitle: "打开本地 Markdown 文件",
    openingFile: "正在打开文件...",
    ready: "就绪",
    renderedMarkdown: "渲染后的 Markdown",
    reset: "恢复初始状态",
    save: "保存",
    saveAs: "另存为",
    saveCancelled: "已取消保存",
    saving: "正在保存...",
    savingCopy: "正在另存为...",
    sectionApplied: "章节修改已应用",
    sectionEditCancelled: "章节编辑已取消",
    sectionEditor: "章节编辑器",
    sectionMarkdownSource: "章节 Markdown 源文",
    sections: "章节",
    testSample: "测试样例",
    unsavedChanges: "有未保存修改",
    usage: "使用说明",
    opened: (fileName) => `已打开 ${fileName}`,
    saved: (fileName) => `已保存 ${fileName}`,
    editSection: (title) => `编辑章节 ${title}`
  }
};

export function detectLanguage(languages: readonly string[] | undefined): Language {
  const [firstLanguage] = languages ?? [];
  if (!firstLanguage) return "en";

  const normalized = firstLanguage.toLowerCase();
  if (normalized === "zh" || normalized.startsWith("zh-")) return "zh-CN";
  if (normalized === "en" || normalized.startsWith("en-")) return "en";
  return "en";
}

export function getSystemLanguages(): readonly string[] | undefined {
  if (typeof navigator === "undefined") return undefined;
  if (navigator.languages?.length) return navigator.languages;
  return navigator.language ? [navigator.language] : undefined;
}
