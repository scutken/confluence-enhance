/**
 * 构建系统测试
 * 验证构建脚本和输出文件
 */

import { describe, test, expect } from 'bun:test';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

describe('构建系统', () => {
  test('构建脚本应该存在', () => {
    const buildScript = join(process.cwd(), 'scripts', 'build.js');
    expect(existsSync(buildScript)).toBe(true);
  });

  test('源文件应该存在', () => {
    const jsFile = join(process.cwd(), 'src', 'wiki-vditor.js');
    const cssFile = join(process.cwd(), 'src', 'wiki-vditor.css');
    
    expect(existsSync(jsFile)).toBe(true);
    expect(existsSync(cssFile)).toBe(true);
  });

  test('构建输出文件应该存在', () => {
    const distDir = join(process.cwd(), 'dist');
    const devFile = join(distDir, 'wiki-vditor.js');
    const minFile = join(distDir, 'wiki-vditor.min.js');
    
    expect(existsSync(devFile)).toBe(true);
    expect(existsSync(minFile)).toBe(true);
  });

  test('构建的JS文件应该包含正确的头部注释', () => {
    const devFile = join(process.cwd(), 'dist', 'wiki-vditor.js');
    
    if (existsSync(devFile)) {
      const content = readFileSync(devFile, 'utf8');
      
      expect(content).toContain('Confluence Enhance - Wiki Vditor');
      expect(content).toContain('Confluence页面Markdown增强工具');
      expect(content).toContain('Vditor');
    }
  });

  test('源文件应该使用正确的命名', () => {
    const jsFile = join(process.cwd(), 'src', 'wiki-vditor.js');
    
    if (existsSync(jsFile)) {
      const content = readFileSync(jsFile, 'utf8');
      
      expect(content).toContain('window.WikiVditor');
      expect(content).toContain('wiki-vditor-container');
      expect(content).toContain('wiki-vditor-btn');
      expect(content).not.toContain('VditorToggle'); // 确保旧名称已被替换
    }
  });
});

describe('package.json配置', () => {
  test('package.json应该有正确的配置', () => {
    const packageFile = join(process.cwd(), 'package.json');
    
    if (existsSync(packageFile)) {
      const content = readFileSync(packageFile, 'utf8');
      const pkg = JSON.parse(content);
      
      expect(pkg.name).toBe('confluence-enhance');
      expect(pkg.main).toBe('dist/wiki-vditor.min.js');
      expect(pkg.scripts).toHaveProperty('build');
      expect(pkg.scripts).toHaveProperty('dev');
      expect(pkg.scripts).toHaveProperty('serve');
      expect(pkg.scripts).toHaveProperty('clean');
    }
  });
});

describe('演示文件', () => {
  test('演示文件应该存在', () => {
    const demoFile = join(process.cwd(), 'examples', 'demo.html');
    const testFile = join(process.cwd(), 'examples', 'test-standalone.html');
    
    expect(existsSync(demoFile)).toBe(true);
    expect(existsSync(testFile)).toBe(true);
  });

  test('演示文件应该引用正确的脚本', () => {
    const demoFile = join(process.cwd(), 'examples', 'demo.html');
    
    if (existsSync(demoFile)) {
      const content = readFileSync(demoFile, 'utf8');
      
      expect(content).toContain('wiki-vditor.min.js');
      expect(content).not.toContain('vditor-toggle-standalone'); // 确保旧引用已被替换
    }
  });
});
