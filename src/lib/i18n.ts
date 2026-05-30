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
  couldNotOpenFile: string;
  couldNotSaveFile: string;
  documentSections: string;
  edit: string;
  editing: string;
  editorPlaceholder: string;
  feedback: string;
  fileAccessDescription: string;
  fileAccessTitle: string;
  language: string;
  languageEnglish: string;
  languageSimplifiedChinese: string;
  noFileOpen: string;
  open: string;
  openCancelled: string;
  openFilePrompt: string;
  openLocalDescription: string;
  openLocalTitle: string;
  openingFile: string;
  ready: string;
  renderedMarkdown: string;
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
  unsavedChanges: string;
};

export const copies: Record<Language, Copy> = {
  en: {
    applySectionEdit: "Apply section edit",
    cancel: "Cancel",
    closeEditor: "Close editor",
    couldNotOpenFile: "Could not open file",
    couldNotSaveFile: "Could not save file",
    documentSections: "Document sections",
    edit: "Edit",
    editing: "Editing",
    editorPlaceholder: "Select a section to edit its Markdown source.",
    feedback: "Feedback",
    fileAccessDescription:
      "HTMLxMarkdown saves directly back to local Markdown files, which currently requires Chrome or Edge with the File System Access API.",
    fileAccessTitle: "Chromium file access required",
    language: "Language",
    languageEnglish: "English",
    languageSimplifiedChinese: "简体中文",
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
    unsavedChanges: "Unsaved changes",
    opened: (fileName) => `Opened ${fileName}`,
    saved: (fileName) => `Saved ${fileName}`,
    editSection: (title) => `Edit section ${title}`
  },
  "zh-CN": {
    applySectionEdit: "应用章节修改",
    cancel: "取消",
    closeEditor: "关闭编辑器",
    couldNotOpenFile: "无法打开文件",
    couldNotSaveFile: "无法保存文件",
    documentSections: "文档章节",
    edit: "编辑",
    editing: "正在编辑",
    editorPlaceholder: "选择一个章节来编辑它的 Markdown 源文。",
    feedback: "反馈",
    fileAccessDescription:
      "HTMLxMarkdown 会直接保存回本地 Markdown 文件，目前需要 Chrome 或 Edge 支持 File System Access API。",
    fileAccessTitle: "需要 Chromium 文件访问能力",
    language: "语言",
    languageEnglish: "English",
    languageSimplifiedChinese: "简体中文",
    noFileOpen: "未打开文件",
    open: "打开",
    openCancelled: "已取消打开",
    openFilePrompt: "打开一个 Markdown 文件以查看它的结构。",
    openLocalDescription: "用结构化 HTML 阅读，按章节编辑源 Markdown，并且只把你修改过的内容保存回文件。",
    openLocalTitle: "打开本地 Markdown 文件",
    openingFile: "正在打开文件...",
    ready: "就绪",
    renderedMarkdown: "渲染后的 Markdown",
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
    unsavedChanges: "有未保存修改",
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
