# Anki Template Designer

<div align="center">

一个用于设计和预览 Anki 卡片模板的在线工具，完全基于浏览器运行，无需安装。

[English](README.md) | [中文](#中文)

</div>

---

## 中文

### 📖 项目简介

Anki Template Designer 是一个功能强大的在线工具，帮助 Anki 用户轻松设计和预览卡片模板。它完全在浏览器中运行，支持实时预览、模板管理、自动保存等功能，让模板设计变得简单高效。

### ✨ 主要功能

- **📝 可视化编辑**
  - 分别编辑 Front、Back 模板和 CSS 样式
  - 支持多种笔记类型（Basic、Cloze 等）
  - 实时语法高亮和代码编辑

- **👀 实时预览**
  - 即时预览卡片效果，所见即所得
  - 支持 Front/Back 切换预览
  - 完全模拟 Anki 的渲染环境

- **🌙 主题支持**
  - 支持日间/夜间模式预览
  - 完整的 Anki CSS 变量系统支持
  - 兼容 Anki 的渲染规则和样式

- **📱 响应式预览**
  - 移动端预览模式
  - 桌面端预览模式
  - 真实还原 Anki 在不同设备上的显示效果

- **💾 模板管理**
  - 本地保存模板到 IndexedDB
  - 支持多个模板的创建、加载、删除
  - 自动保存功能，防止数据丢失

- **🎨 Anki 兼容性**
  - 完全遵循 Anki 的 HTML/CSS 渲染规则
  - 支持 Anki 的所有 CSS 变量
  - 兼容夜间模式类名（night-mode、night_mode、nightMode）
  - 正确处理 Cloze 删除卡片（Front 显示占位符，Back 显示答案）

- **📤 导出功能**
  - 一键导出模板代码
  - 方便复制到 Anki 中使用

### 🚀 快速开始

```bash
# 克隆仓库
git clone https://github.com/YOUR_USERNAME/anki-template-designer.git
cd anki-template-designer

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 📖 使用指南

1. **创建模板**
   - 点击"新建"按钮创建新模板
   - 输入模板名称
   - 选择笔记类型（Basic 或 Cloze）

2. **编辑模板**
   - 在左侧编辑区编辑 Front、Back 模板和 CSS
   - 在右侧实时预览效果
   - 修改会自动保存（如果已关联模板）

3. **管理字段**
   - 在左侧字段管理区添加/删除字段
   - 编辑示例数据用于预览

4. **保存和加载**
   - 点击"保存"按钮保存模板
   - 点击"加载"按钮加载已保存的模板
   - 模板数据存储在浏览器本地（IndexedDB）

5. **在 Anki 中使用**
   - 手动复制编辑器中的 Front、Back 模板和 CSS
   - 粘贴到 Anki 的卡片模板编辑器中
   - 或使用"导出"按钮一次性导出所有模板代码

### 🛠️ 技术栈

- **[Svelte 5](https://svelte.dev/)** - 现代化的 UI 框架，使用 Runes 模式
- **[Vite](https://vitejs.dev/)** - 快速的构建工具和开发服务器
- **[TypeScript](https://www.typescriptlang.org/)** - 类型安全的 JavaScript
- **[IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)** - 浏览器本地数据库存储
- **[Tailwind CSS](https://tailwindcss.com/)** - 实用优先的 CSS 框架
- **[unplugin-icons](https://github.com/antfu/unplugin-icons)** - 图标系统

### 📦 项目结构

```
anki-template-designer/
├── src/
│   ├── lib/
│   │   ├── components/      # Svelte 组件
│   │   │   ├── Header.svelte
│   │   │   ├── EditorPane.svelte
│   │   │   ├── PreviewPane.svelte
│   │   │   ├── FieldManager.svelte
│   │   │   └── ...
│   │   ├── stores/          # 状态管理
│   │   │   ├── appState.svelte.ts
│   │   │   └── toast.svelte.ts
│   │   ├── utils/           # 工具函数
│   │   │   └── storage.ts   # IndexedDB 存储
│   │   └── anki-styles.ts   # Anki CSS 生成器
│   └── main.ts
├── rules/                   # 项目规则文档
│   └── anki-rendering.mdc   # Anki 渲染规则
└── vite.config.js
```

### 📝 开发说明

#### 环境要求

- Node.js >= 20
- npm >= 9

#### 开发命令

```bash
# 开发模式（热重载）
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 同步 Anki 参考代码（可选）
npm run sync-anki
```

#### 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 Svelte 5 Runes 模式的最佳实践
- 组件使用 Composition API 风格

### 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 📄 许可证

本项目采用 GNU Affero 通用公共许可证 v3.0 或更高版本。详情请参阅 [LICENSE](LICENSE) 文件。

更多信息请访问 [GNU AGPL v3](https://www.gnu.org/licenses/agpl-3.0.html)。

