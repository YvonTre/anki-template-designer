#!/usr/bin/env node

/**
 * 从 Anki 仓库同步参考文件
 * 用于更新 Sass 变量、CSS 和 webview 实现的参考
 */

import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const referenceDir = join(projectRoot, 'anki-reference');

// Anki 仓库的特定 commit
const ANKI_COMMIT = 'dda192f24c201fc6baf276cb243adfe2a5a95825';
const ANKI_BASE_URL = `https://raw.githubusercontent.com/ankitects/anki/${ANKI_COMMIT}`;

// 需要下载的文件列表
const FILES_TO_SYNC = [
  // Sass 变量和颜色定义
  { path: 'ts/lib/sass/_vars.scss', dest: 'sass/_vars.scss' },
  { path: 'ts/lib/sass/_color-palette.scss', dest: 'sass/_color-palette.scss' },
  { path: 'ts/lib/sass/_functions.scss', dest: 'sass/_functions.scss' },

  // Webview Python 实现
  { path: 'qt/aqt/webview.py', dest: 'webview/webview.py' },

  // CSS/SCSS 文件
  { path: 'qt/aqt/data/web/css/webview.scss', dest: 'css/webview.scss' },
];

async function downloadFile(url, destPath) {
  console.log(`📦 下载: ${url}`);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const content = await response.text();

    // 确保目标目录存在
    await mkdir(dirname(destPath), { recursive: true });

    // 写入文件
    await writeFile(destPath, content, 'utf-8');

    console.log(`✅ 已保存: ${destPath}`);
    return true;
  } catch (error) {
    console.error(`❌ 下载失败: ${url}`);
    console.error(`   错误: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 开始同步 Anki 参考文件...\n');
  console.log(`📌 Commit: ${ANKI_COMMIT}\n`);

  let successCount = 0;
  let failCount = 0;

  for (const file of FILES_TO_SYNC) {
    const url = `${ANKI_BASE_URL}/${file.path}`;
    const destPath = join(referenceDir, file.dest);

    const success = await downloadFile(url, destPath);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    // 稍微延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n📊 同步完成:');
  console.log(`   ✅ 成功: ${successCount}`);
  console.log(`   ❌ 失败: ${failCount}`);

  if (failCount > 0) {
    console.log('\n⚠️  部分文件下载失败，请检查网络连接或文件路径是否正确');
    process.exit(1);
  }

  console.log('\n✨ 所有参考文件已同步到 anki-reference/ 目录');
}

main().catch(error => {
  console.error('💥 脚本执行失败:', error);
  process.exit(1);
});
