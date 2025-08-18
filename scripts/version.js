/**
 * Confluence Enhance - 版本管理脚本
 * 自动更新版本号并创建Git标签
 */

const { readFileSync, writeFileSync } = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const projectRoot = path.dirname(__dirname);
const packagePath = path.join(projectRoot, 'package.json');

// 获取命令行参数
const versionType = process.argv[2] || 'patch'; // patch, minor, major

console.log(`🏷️  正在更新版本号 (${versionType})...\n`);

try {
  // 读取当前package.json
  const packageContent = readFileSync(packagePath, 'utf8');
  const packageJson = JSON.parse(packageContent);
  
  const currentVersion = packageJson.version;
  console.log(`📋 当前版本: ${currentVersion}`);
  
  // 解析版本号
  const versionParts = currentVersion.split('.').map(Number);
  let [major, minor, patch] = versionParts;
  
  // 根据类型更新版本号
  switch (versionType) {
    case 'major':
      major += 1;
      minor = 0;
      patch = 0;
      break;
    case 'minor':
      minor += 1;
      patch = 0;
      break;
    case 'patch':
    default:
      patch += 1;
      break;
  }
  
  const newVersion = `${major}.${minor}.${patch}`;
  console.log(`🆕 新版本: ${newVersion}`);
  
  // 更新package.json
  packageJson.version = newVersion;
  writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log('✅ 已更新 package.json');
  
  // 提交更改
  console.log('\n📝 提交版本更新...');
  execSync('git add package.json', { stdio: 'inherit', cwd: projectRoot });
  execSync(`git commit -m "chore: bump version to ${newVersion}"`, { 
    stdio: 'inherit', 
    cwd: projectRoot 
  });
  
  // 创建Git标签
  console.log(`\n🏷️  创建Git标签 v${newVersion}...`);
  execSync(`git tag -a v${newVersion} -m "Release v${newVersion}"`, { 
    stdio: 'inherit', 
    cwd: projectRoot 
  });
  
  console.log(`\n🎉 版本更新完成！`);
  console.log(`📦 新版本: v${newVersion}`);
  console.log(`🔗 Git标签已创建`);
  console.log(`\n💡 下一步：运行 'git push --follow-tags' 推送到远程仓库`);
  
} catch (error) {
  console.error('❌ 版本更新失败:', error.message);
  process.exit(1);
}
