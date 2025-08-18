/**
 * Confluence Enhance - 清理脚本
 * 清理构建输出文件
 */

const { rmSync, existsSync } = require('fs');
const path = require('path');

const projectRoot = path.dirname(__dirname);

console.log('🧹 清理构建文件...\n');

const distDir = path.join(projectRoot, 'dist');

if (existsSync(distDir)) {
  try {
    rmSync(distDir, { recursive: true, force: true });
    console.log('✅ 已清理 dist/ 目录');
  } catch (error) {
    console.error('❌ 清理失败:', error.message);
    process.exit(1);
  }
} else {
  console.log('ℹ️  dist/ 目录不存在，无需清理');
}

console.log('\n🎉 清理完成！');
