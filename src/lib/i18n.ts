import { writable, get } from "svelte/store";

type Locale = "en" | "zh";

type TranslationNode = string | { [key: string]: TranslationNode };

const translations: Record<Locale, TranslationNode> = {
  en: {
    app: { name: "Anki Template Designer" },
    common: {
      unsaved: "Unsaved",
      status: {
        saving: "Saving...",
        autoSaving: "Auto-saving...",
        saved: "Saved successfully",
        autoSaved: "Auto-saved",
        error: "Save failed",
      },
      buttons: {
        new: "New",
        save: "Save",
        load: "Load",
        export: "Export",
        add: "Add",
        delete: "Delete",
        confirm: "Confirm",
        cancel: "Cancel",
        create: "Create",
      },
      labels: {
        deleteInProgress: "Deleting...",
        createInProgress: "Creating...",
      },
      aria: {
        close: "Close",
        closeDialog: "Close dialog",
        closeLoadDialog: "Close load templates dialog",
        closeNewTemplateDialog: "Close new template dialog",
        closeToast: "Close notification",
        toggleMobile: "Toggle mobile view",
        toggleNight: "Toggle night mode",
        resizeSplitPane: "Resize split pane",
      },
      placeholders: {
        noteTypeName: "Note type name...",
        sampleData: "Sample data for {field}...",
        newFieldName: "New field name...",
        frontHtml: "Front template HTML...",
        backHtml: "Back template HTML...",
        css: "CSS...",
        templateName: "Enter template name...",
      },
    },
    header: {
      title: "Anki Template Designer",
      templateIndicator: "Unsaved",
    },
    noteTypes: {
      basic: "Basic",
      cloze: "Cloze",
    },
    fieldManager: {
      noteType: "Note Type",
      addNoteType: "Add note type",
      deleteNoteType: "Delete note type",
      fields: "Fields",
      add: "Add",
      removeField: "Remove field",
    },
    defaults: {
      sampleData: {
        basicFront: "What is the capital of France?",
        basicBack: "Paris",
        clozeText: "The capital of France is {{c1::Paris}}.",
        clozeExtra: "It is a beautiful city.",
      },
    },
    editorPane: {
      front: "Front Template",
      back: "Back Template",
      css: "Styling (CSS)",
    },
    previewPane: {
      frontTab: "Front",
      backTab: "Back",
      iframeTitle: "Card Preview",
      documentTitle: "Anki Preview",
    },
    loadDialog: {
      title: "Load Templates",
      overlayAria: "Close load templates dialog",
      closeAria: "Close",
      loading: "Loading...",
      empty: "No saved templates",
      updatedAt: "Updated {date}",
      delete: "Delete",
      deleting: "Deleting...",
      confirmTitle: "Delete Template",
      confirmMessage: "Delete this template? This action cannot be undone.",
      toast: {
        listError: "Failed to load template list",
        loadSuccess: "Template loaded successfully",
        loadError: "Failed to load template",
        deleteSuccess: "Template deleted successfully",
        deleteError: "Failed to delete template",
      },
    },
    newTemplateDialog: {
      title: "New Template",
      overlayAria: "Close new template dialog",
      closeAria: "Close",
      description: "Create a new template. Current settings will be saved.",
      label: "Template name",
      placeholder: "Enter template name...",
      creating: "Creating...",
      create: "Create",
      cancel: "Cancel",
      toast: {
        missingName: "Please enter a template name",
        success: "Template created successfully",
        error: "Failed to create template",
      },
    },
    confirmDialog: {
      overlayAria: "Close dialog",
    },
    toast: {
      closeAria: "Close notification",
    },
    export: {
      frontLabel: "Front Template:",
      backLabel: "Back Template:",
      cssLabel: "Styling:",
      fileName: "anki-template.txt",
    },
    codeEditor: {
      clozeNumberInfo: "Cloze deletion {index}",
      fieldInfo: "Field: {field}",
      specialFieldInfo: "Special field: {field}",
      clozeSyntaxInfo: "Cloze deletion syntax: {{cloze:FieldName}}",
      cssVarInfo: "Anki CSS variable",
    },
  },
  zh: {
    app: { name: "Anki 模板设计器" },
    common: {
      unsaved: "未保存",
      status: {
        saving: "保存中...",
        autoSaving: "自动保存中...",
        saved: "保存成功",
        autoSaved: "已自动保存",
        error: "保存失败",
      },
      buttons: {
        new: "新建",
        save: "保存",
        load: "加载",
        export: "导出",
        add: "添加",
        delete: "删除",
        confirm: "确认",
        cancel: "取消",
        create: "创建",
      },
      labels: {
        deleteInProgress: "删除中...",
        createInProgress: "创建中...",
      },
      aria: {
        close: "关闭",
        closeDialog: "关闭对话框",
        closeLoadDialog: "关闭加载模板对话框",
        closeNewTemplateDialog: "关闭新建模板对话框",
        closeToast: "关闭通知",
        toggleMobile: "切换移动端预览",
        toggleNight: "切换夜间模式",
        resizeSplitPane: "调整分栏大小",
      },
      placeholders: {
        noteTypeName: "输入笔记类型名称...",
        sampleData: "为 {field} 输入示例内容...",
        newFieldName: "新字段名称...",
        frontHtml: "正面模板 HTML...",
        backHtml: "背面模板 HTML...",
        css: "CSS...",
        templateName: "输入模板名称...",
      },
    },
    header: {
      title: "Anki 模板设计器",
      templateIndicator: "未保存",
    },
    noteTypes: {
      basic: "问答题",
      cloze: "填空题",
    },
    fieldManager: {
      noteType: "笔记类型",
      addNoteType: "添加笔记类型",
      deleteNoteType: "删除笔记类型",
      fields: "字段",
      add: "添加",
      removeField: "删除字段",
    },
    defaults: {
      sampleData: {
        basicFront: "法国的首都是哪里？",
        basicBack: "巴黎",
        clozeText: "法国的首都是 {{c1::巴黎}}。",
        clozeExtra: "它是一座美丽的城市。",
      },
    },
    editorPane: {
      front: "正面模板",
      back: "背面模板",
      css: "样式（CSS）",
    },
    previewPane: {
      frontTab: "正面",
      backTab: "背面",
      iframeTitle: "卡片预览",
      documentTitle: "Anki 预览",
    },
    loadDialog: {
      title: "加载模板",
      overlayAria: "关闭加载模板对话框",
      closeAria: "关闭",
      loading: "加载中...",
      empty: "暂无保存的模板",
      updatedAt: "更新于 {date}",
      delete: "删除",
      deleting: "删除中...",
      confirmTitle: "删除模板",
      confirmMessage: "确定要删除这个模板吗？此操作无法撤销。",
      toast: {
        listError: "加载模板列表失败",
        loadSuccess: "模板加载成功",
        loadError: "加载失败",
        deleteSuccess: "模板删除成功",
        deleteError: "删除失败",
      },
    },
    newTemplateDialog: {
      title: "新建模板",
      overlayAria: "关闭新建模板对话框",
      closeAria: "关闭",
      description: "创建一个新模板，当前的所有设置将被保存。",
      label: "模板名称",
      placeholder: "输入模板名称...",
      creating: "创建中...",
      create: "创建",
      cancel: "取消",
      toast: {
        missingName: "请输入模板名称",
        success: "模板创建成功",
        error: "创建失败",
      },
    },
    confirmDialog: {
      overlayAria: "关闭对话框",
    },
    toast: {
      closeAria: "关闭通知",
    },
    export: {
      frontLabel: "正面模板：",
      backLabel: "背面模板：",
      cssLabel: "样式：",
      fileName: "anki模板.txt",
    },
    codeEditor: {
      clozeNumberInfo: "完形填空 {index}",
      fieldInfo: "字段：{field}",
      specialFieldInfo: "特殊字段：{field}",
      clozeSyntaxInfo: "完形填空语法：{{cloze:FieldName}}",
      cssVarInfo: "Anki CSS 变量",
    },
  },
} as const;

const FALLBACK_LOCALE: Locale = "en";

function detectLocale(): Locale {
  if (typeof navigator === "undefined") {
    return FALLBACK_LOCALE;
  }
  const candidates = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  for (const lang of candidates) {
    if (lang?.toLowerCase().startsWith("zh")) {
      return "zh";
    }
  }
  return "en";
}

function applyDocumentLanguage(lang: Locale) {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }
}

const initialLocale = detectLocale();
const localeStore = writable<Locale>(initialLocale);
applyDocumentLanguage(initialLocale);

if (typeof window !== "undefined") {
  window.addEventListener("languagechange", () => {
    const next = detectLocale();
    localeStore.set(next);
    applyDocumentLanguage(next);
  });
}

function getMessage(localeKey: Locale, path: string): string | undefined {
  const parts = path.split(".");
  let node: TranslationNode | undefined = translations[localeKey];

  for (const part of parts) {
    if (!node || typeof node === "string") {
      break;
    }
    node = node[part];
  }

  return typeof node === "string" ? node : undefined;
}

function formatMessage(
  template: string,
  values?: Record<string, string | number>,
): string {
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const value = values[key];
    return value === undefined ? `{${key}}` : String(value);
  });
}

export const locale = localeStore;
export type { Locale };

export function setLocale(next: Locale) {
  localeStore.set(next);
  applyDocumentLanguage(next);
}

export function getLocale(): Locale {
  return get(localeStore);
}

export function translate(
  lang: Locale,
  path: string,
  values?: Record<string, string | number>,
): string {
  const message = getMessage(lang, path) ?? getMessage(FALLBACK_LOCALE, path);
  if (!message) {
    return path;
  }
  return formatMessage(message, values);
}

export function formatDateTime(
  timestamp: number,
  lang: Locale,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  },
): string {
  const localeTag = lang === "zh" ? "zh-CN" : "en-US";
  try {
    return new Intl.DateTimeFormat(localeTag, options).format(
      new Date(timestamp),
    );
  } catch {
    return new Date(timestamp).toLocaleString(localeTag, options);
  }
}


