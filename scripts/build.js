#!/usr/bin/env node

/**
 * Confluence增强工具 - 独立版本构建脚本
 *
 * 功能：
 * - 将Vditor库完整内嵌到JavaScript文件中
 * - 自动注入所有必要的CSS样式
 * - 生成压缩和未压缩版本
 * - 实现真正的单文件部署
 *
 * 使用方法：
 * npm run build 或 bun run build
 */

const fs = require('fs');
const path = require('path');

// 获取项目根目录
const projectRoot = path.dirname(__dirname);

// 读取文件内容的辅助函数
function readFile(filePath) {
  try {
    const fullPath = path.resolve(projectRoot, filePath);
    return fs.readFileSync(fullPath, 'utf8');
  } catch (error) {
    console.error(`❌ 无法读取文件 ${filePath}:`, error.message);
    return '';
  }
}

// 写入文件的辅助函数
function writeFile(filePath, content) {
  try {
    const fullPath = path.resolve(projectRoot, filePath);
    // 确保目录存在
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ 成功创建文件: ${filePath}`);
  } catch (error) {
    console.error(`❌ 无法写入文件 ${filePath}:`, error.message);
  }
}

// CSS转义函数，将CSS内容转换为JavaScript字符串
function escapeCSSForJS(css) {
  return css
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$')
    .replace(/\r?\n/g, '\\n')
    .replace(/\t/g, '\\t');
}

console.log('🚀 开始构建 Confluence Enhance - Wiki Vditor...');

// 读取Vditor的JavaScript文件
const vditorJS = readFile('node_modules/vditor/dist/index.min.js');
if (!vditorJS) {
  console.error('❌ 无法找到Vditor的JavaScript文件');
  process.exit(1);
}

// 读取Vditor的CSS文件
const vditorCSS = readFile('node_modules/vditor/dist/index.css');
if (!vditorCSS) {
  console.error('❌ 无法找到Vditor的CSS文件');
  process.exit(1);
}

// 读取我们的CSS文件
const toggleCSS = readFile('src/wiki-vditor.css');
if (!toggleCSS) {
  console.error('❌ 无法找到wiki-vditor.css文件');
  process.exit(1);
}

// 读取我们的JavaScript功能代码
let toggleJS = readFile('src/wiki-vditor.js');
if (!toggleJS) {
  console.error('❌ 无法找到wiki-vditor.js文件');
  process.exit(1);
}

// 修改toggleJS，移除外部依赖检查，因为Vditor已经内嵌
toggleJS = toggleJS.replace(
  /\/\/ 检查Vditor是否可用（用于非独立版本）[\s\S]*?return true;\s*}/g,
  `// Vditor已内嵌，跳过外部依赖检查
  function checkVditorAvailability() {
    return true; // 独立版本中Vditor总是可用
  }`
);

// 获取Vditor版本信息
let vditorVersion = '3.11.1';
try {
  const vditorPackage = JSON.parse(readFile('node_modules/vditor/package.json'));
  vditorVersion = vditorPackage.version;
} catch (error) {
  console.warn('无法读取Vditor版本信息，使用默认版本');
}

// 构建最终的JavaScript文件内容
const standaloneContent = `/*!
 * Confluence Enhance - Wiki Vditor
 * Confluence页面Markdown增强工具，包含Vditor及其所有依赖
 *
 * 包含的组件：
 * - Vditor ${vditorVersion}
 * - Wiki Vditor功能模块
 * - 所有必要的CSS样式
 *
 * 使用方法：
 * 1. 在HTML页面中引入此文件：<script src="wiki-vditor.min.js"></script>
 * 2. 确保页面中有符合条件的Confluence markdown内容块
 * 3. 脚本会自动初始化并添加切换功能
 */

(function() {
  'use strict';

  // 样式注入函数
  function injectCSS(css, id) {
    if (document.getElementById(id)) {
      return; // 避免重复注入
    }
    
    const style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
  }

  // 注入Vditor的CSS样式
  injectCSS(\`${escapeCSSForJS(vditorCSS)}\`, 'vditor-styles');

  // 注入我们的CSS样式
  injectCSS(\`${escapeCSSForJS(toggleCSS)}\`, 'wiki-vditor-styles');

  // 使用eval在全局作用域执行Vditor代码
  (function() {
    try {
      // 使用eval在全局作用域执行，确保Vditor被设置为全局变量
      (1, eval)(${JSON.stringify(vditorJS)});

      // 验证Vditor是否成功加载
      if (typeof window.Vditor !== 'undefined') {
        console.log('✅ Vditor已成功加载到全局作用域');
      } else {
        console.error('❌ Vditor加载失败');
      }
    } catch (error) {
      console.error('❌ Vditor加载出错:', error);
    }
  })();

  // 我们的WikiVditor功能代码
  ${toggleJS}

})();
`;

// 写入最终文件
writeFile('dist/wiki-vditor.js', standaloneContent);

console.log('🎉 构建完成！');
console.log('');
console.log('📁 生成的文件：');
console.log('  - dist/wiki-vditor.js (开发版本)');
console.log('');
console.log('📖 使用方法：');
console.log('  在HTML页面中引入：<script src="wiki-vditor.min.js"></script>');
console.log('  无需额外引入Vditor或其他依赖！');
