# Anki Template Designer

<div align="center">

A powerful online tool for designing and previewing Anki card templates, running entirely in the browser with no installation required.

[English](#english) | [中文](README.zh-CN.md)

</div>

---

## English

### 📖 Introduction

Anki Template Designer is a powerful online tool that helps Anki users easily design and preview card templates. It runs entirely in the browser, supporting real-time preview, template management, auto-save, and more, making template design simple and efficient.

### ✨ Features

- **📝 Visual Editing**
  - Edit Front, Back templates and CSS styles separately
  - Support multiple note types (Basic, Cloze, etc.)
  - Real-time syntax highlighting and code editing

- **👀 Real-time Preview**
  - Instant preview of card effects, WYSIWYG
  - Support Front/Back toggle preview
  - Fully simulates Anki's rendering environment

- **🌙 Theme Support**
  - Support day/night mode preview
  - Complete Anki CSS variable system support
  - Compatible with Anki's rendering rules and styles

- **📱 Responsive Preview**
  - Mobile preview mode
  - Desktop preview mode
  - Accurately reproduces Anki's display on different devices

- **💾 Template Management**
  - Save templates locally to IndexedDB
  - Support creating, loading, and deleting multiple templates
  - Auto-save functionality to prevent data loss

- **🎨 Anki Compatibility**
  - Fully follows Anki's HTML/CSS rendering rules
  - Supports all Anki CSS variables
  - Compatible with night mode class names (night-mode, night_mode, nightMode)
  - Correctly handles Cloze deletion cards (Front shows placeholder, Back shows answer)

- **📤 Export Functionality**
  - One-click export of template code
  - Easy to copy and use in Anki

### 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/anki-template-designer.git
cd anki-template-designer

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### 📖 User Guide

1. **Create Template**
   - Click "New" button to create a new template
   - Enter template name
   - Select note type (Basic or Cloze)

2. **Edit Template**
   - Edit Front, Back templates and CSS in the left editor
   - Preview effects in real-time on the right
   - Changes are auto-saved (if template is associated)

3. **Manage Fields**
   - Add/remove fields in the left field manager
   - Edit sample data for preview

4. **Save and Load**
   - Click "Save" button to save template
   - Click "Load" button to load saved templates
   - Template data is stored locally in browser (IndexedDB)

5. **Use in Anki**
   - Manually copy the Front, Back templates and CSS from the editor
   - Paste them into Anki's card template editor
   - Or use the "Export" button to export all template code at once

### 🛠️ Tech Stack

- **[Svelte 5](https://svelte.dev/)** - Modern UI framework using Runes mode
- **[Vite](https://vitejs.dev/)** - Fast build tool and dev server
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)** - Browser local database storage
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[unplugin-icons](https://github.com/antfu/unplugin-icons)** - Icon system

### 📦 Project Structure

```
anki-template-designer/
├── src/
│   ├── lib/
│   │   ├── components/      # Svelte components
│   │   │   ├── Header.svelte
│   │   │   ├── EditorPane.svelte
│   │   │   ├── PreviewPane.svelte
│   │   │   ├── FieldManager.svelte
│   │   │   └── ...
│   │   ├── stores/          # State management
│   │   │   ├── appState.svelte.ts
│   │   │   └── toast.svelte.ts
│   │   ├── utils/           # Utilities
│   │   │   └── storage.ts   # IndexedDB storage
│   │   └── anki-styles.ts   # Anki CSS generator
│   └── main.ts
├── rules/                   # Project rules
│   └── anki-rendering.mdc   # Anki rendering rules
└── vite.config.js
```

### 📝 Development

#### Requirements

- Node.js >= 20
- npm >= 9

#### Development Commands

```bash
# Development mode (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Sync Anki reference code (optional)
npm run sync-anki
```

#### Code Standards

- Use TypeScript for type checking
- Follow Svelte 5 Runes mode best practices
- Components use Composition API style

### 🤝 Contributing

Issues and Pull Requests are welcome!

### 📄 License

This project is licensed under the GNU Affero General Public License v3.0 or later. See the [LICENSE](LICENSE) file for details.

For more information, visit [GNU AGPL v3](https://www.gnu.org/licenses/agpl-3.0.html).
