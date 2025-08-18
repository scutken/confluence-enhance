/**
 * Confluence Enhance - 开发服务器启动脚本
 * 构建项目并启动HTTP服务器，显示可用的演示页面
 */

const { execSync } = require('child_process');
const path = require('path');

const projectRoot = path.dirname(__dirname);

console.log('🚀 Confluence Enhance - 开发服务器启动中...\n');

try {
  // 首先构建项目
  console.log('📦 正在构建项目...');
  execSync('bun run build', {
    stdio: 'inherit',
    cwd: projectRoot
  });

  console.log('\n✅ 构建完成！正在启动开发服务器...\n');

  // 启动Bun HTTP服务器
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

  console.log('🎉 开发服务器启动成功！\n');
  console.log('📋 可用的演示页面：');
  console.log('  🎯 完整功能演示: \x1b[36mhttp://localhost:8080/examples/demo.html\x1b[0m');
  console.log('  🧪 功能测试页面: \x1b[36mhttp://localhost:8080/examples/test-standalone.html\x1b[0m');
  console.log('  📊 对比演示页面: \x1b[36mhttp://localhost:8080/examples/comparison-test.html\x1b[0m');
  console.log('  📖 项目文档: \x1b[36mhttp://localhost:8080/docs/\x1b[0m');
  console.log('\n💡 推荐从完整功能演示开始: \x1b[33mhttp://localhost:8080/examples/demo.html\x1b[0m\n');
  console.log('按 Ctrl+C 停止服务器');

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

} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
}
