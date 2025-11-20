# Anki Template Designer

一个用于设计和预览 Anki 卡片模板的在线工具。

## 功能特性

- 📝 可视化编辑 Anki 卡片模板（Front、Back、CSS）
- 👀 实时预览卡片效果
- 🌙 支持夜间模式预览
- 📱 支持移动端预览
- 💾 本地保存模板到 IndexedDB
- 🔄 自动保存功能
- 🎨 完整的 Anki CSS 变量系统支持
- 🔧 兼容 Anki 的渲染规则

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 部署到 GitHub Pages

本项目已配置 GitHub Actions 自动部署到 GitHub Pages。

### 设置步骤

1. **创建 GitHub 仓库**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/anki-template-designer.git
   git push -u origin main
   ```

2. **启用 GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source 选择 "GitHub Actions"
   - 保存设置

3. **更新 base 路径（如果需要）**
   - 如果仓库名不是 `anki-template-designer`，需要修改 `vite.config.js` 中的 `base` 路径
   - 例如：如果仓库名是 `my-anki-designer`，则改为 `base: '/my-anki-designer/'`

4. **推送代码**
   - 每次推送到 `main` 分支时，GitHub Actions 会自动构建并部署

### 自定义域名（可选）

如果使用自定义域名：
1. 在仓库 Settings → Pages 中设置 Custom domain
2. 修改 `vite.config.js` 中的 `base` 为 `'/'`
3. 重新部署

## 技术栈

- [Svelte 5](https://svelte.dev/) - UI 框架
- [Vite](https://vitejs.dev/) - 构建工具
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) - 本地存储

## 许可证

MIT
