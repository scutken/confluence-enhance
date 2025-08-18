/**
 * Confluence Enhance - HTTP服务器启动脚本
 * 使用Bun内置服务器，避免Node.js弃用警告
 */

const path = require('path');

const projectRoot = path.dirname(__dirname);

console.log('🌐 启动Bun HTTP服务器...\n');

// 使用Bun内置服务器
const server = Bun.serve({
  port: 8080,
  async fetch(req) {
    const url = new URL(req.url);
    let filePath = url.pathname;

    // 默认文件
    if (filePath === '/') {
      filePath = '/index.html';
    }

    // 构建完整路径
    const fullPath = path.join(projectRoot, filePath);

    try {
      const file = Bun.file(fullPath);

      // 检查文件是否存在
      if (!(await file.exists())) {
        return new Response('404 Not Found', { status: 404 });
      }

      // 获取MIME类型
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
      };

      const contentType = mimeTypes[ext] || 'application/octet-stream';

      return new Response(file, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache'
        }
      });
    } catch (error) {
      console.error('服务器错误:', error);
      return new Response('500 Internal Server Error', { status: 500 });
    }
  }
});

console.log(`✅ 服务器已启动！`);
console.log(`🌐 访问地址: http://localhost:${server.port}`);
console.log('\n按 Ctrl+C 停止服务器\n');

// 处理进程退出
process.on('SIGINT', () => {
  console.log('\n正在停止服务器...');
  server.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  server.stop();
  process.exit(0);
});
