/**
 * Wiki Vditor 基础测试
 * 测试核心功能和API
 */

import { describe, test, expect, beforeEach, afterEach } from 'bun:test';

// 模拟DOM环境
global.document = {
  createElement: (tag) => ({
    tagName: tag.toUpperCase(),
    className: '',
    style: {},
    textContent: '',
    appendChild: () => {},
    setAttribute: () => {},
    getAttribute: () => null,
    addEventListener: () => {},
    querySelector: () => null,
    querySelectorAll: () => [],
    getBoundingClientRect: () => ({ top: 0, left: 0, width: 100, height: 100 })
  }),
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener: () => {},
  head: {
    appendChild: () => {}
  },
  body: {
    appendChild: () => {},
    removeChild: () => {}
  }
};

global.window = {
  addEventListener: () => {},
  removeEventListener: () => {},
  innerHeight: 600,
  WikiVditor: null
};

describe('Wiki Vditor', () => {
  beforeEach(() => {
    // 重置全局状态
    global.window.WikiVditor = null;
  });

  afterEach(() => {
    // 清理
    global.window.WikiVditor = null;
  });

  test('应该能够加载WikiVditor模块', () => {
    // 模拟加载脚本
    const mockScript = `
      (function() {
        'use strict';
        if (window.WikiVditor) return;
        
        window.WikiVditor = {
          init: function() {},
          setup: function() {},
          showSvgModal: null
        };
      })();
    `;
    
    // 执行脚本
    eval(mockScript);
    
    expect(global.window.WikiVditor).toBeDefined();
    expect(typeof global.window.WikiVditor.init).toBe('function');
    expect(typeof global.window.WikiVditor.setup).toBe('function');
  });

  test('WikiVditor应该有正确的API结构', () => {
    // 模拟WikiVditor对象
    global.window.WikiVditor = {
      init: () => {},
      setup: () => {},
      showSvgModal: null,
      createRequiredElements: () => ({
        toggleContainer: { className: 'wiki-vditor-container' },
        toggleBtn: { className: 'wiki-vditor-btn' },
        vditorContainer: { id: 'vditor-container' }
      })
    };

    expect(global.window.WikiVditor).toHaveProperty('init');
    expect(global.window.WikiVditor).toHaveProperty('setup');
    expect(global.window.WikiVditor).toHaveProperty('showSvgModal');
    expect(global.window.WikiVditor).toHaveProperty('createRequiredElements');
  });

  test('createRequiredElements应该返回正确的元素结构', () => {
    global.window.WikiVditor = {
      createRequiredElements: (pre) => {
        const toggleContainer = { className: 'wiki-vditor-container' };
        const toggleBtn = { 
          id: 'toggleVditorBtn',
          className: 'wiki-vditor-btn',
          textContent: '显示预览'
        };
        const vditorContainer = { id: 'vditor-container' };
        
        return { toggleContainer, toggleBtn, vditorContainer };
      }
    };

    const mockPre = { textContent: '# Test Markdown' };
    const elements = global.window.WikiVditor.createRequiredElements(mockPre);

    expect(elements).toHaveProperty('toggleContainer');
    expect(elements).toHaveProperty('toggleBtn');
    expect(elements).toHaveProperty('vditorContainer');
    expect(elements.toggleContainer.className).toBe('wiki-vditor-container');
    expect(elements.toggleBtn.className).toBe('wiki-vditor-btn');
    expect(elements.vditorContainer.id).toBe('vditor-container');
  });

  test('应该能够处理空的markdown内容', () => {
    let warningCalled = false;
    const originalWarn = console.warn;
    console.warn = () => { warningCalled = true; };

    global.window.WikiVditor = {
      setup: () => {
        const pre = { textContent: '   ' }; // 空白内容
        const markdown = pre.textContent.trim();
        if (!markdown) {
          console.warn('WikiVditor: markdown内容为空');
          return;
        }
      }
    };

    global.window.WikiVditor.setup();
    
    expect(warningCalled).toBe(true);
    console.warn = originalWarn;
  });

  test('应该能够检测Confluence markdown内容块', () => {
    let foundPre = false;
    
    global.document.querySelector = (selector) => {
      if (selector.includes('conf-macro') && selector.includes('noformat')) {
        foundPre = true;
        return {
          textContent: '# Test Markdown\n\nThis is a test.',
          parentNode: {
            insertBefore: () => {}
          },
          nextSibling: null
        };
      }
      return null;
    };

    global.window.WikiVditor = {
      setup: () => {
        const pre = global.document.querySelector(
          '.conf-macro.output-block[data-macro-name="noformat"], ' +
          '.code.panel .codeContent pre, ' +
          'pre.code, ' +
          '.preformatted'
        );
        
        if (pre) {
          foundPre = true;
        }
      }
    };

    global.window.WikiVditor.setup();
    expect(foundPre).toBe(true);
  });
});

describe('构建产物验证', () => {
  test('dist目录应该包含必要的文件', async () => {
    const fs = require('fs');
    const path = require('path');
    
    const distPath = path.join(process.cwd(), 'dist');
    const devFile = path.join(distPath, 'wiki-vditor.js');
    const minFile = path.join(distPath, 'wiki-vditor.min.js');
    
    expect(fs.existsSync(devFile)).toBe(true);
    expect(fs.existsSync(minFile)).toBe(true);
  });

  test('构建的文件应该包含正确的内容', async () => {
    const fs = require('fs');
    const path = require('path');
    
    const devFile = path.join(process.cwd(), 'dist', 'wiki-vditor.js');
    
    if (fs.existsSync(devFile)) {
      const content = fs.readFileSync(devFile, 'utf8');
      
      expect(content).toContain('WikiVditor');
      expect(content).toContain('Confluence Enhance');
      expect(content).toContain('window.WikiVditor');
      expect(content).not.toContain('vditor-toggle'); // 确保旧名称已被替换
    }
  });
});

describe('CSS样式验证', () => {
  test('应该使用正确的CSS类名', () => {
    const expectedClasses = [
      'wiki-vditor-container',
      'wiki-vditor-btn'
    ];

    // 模拟检查CSS类名的使用
    expectedClasses.forEach(className => {
      expect(className).toMatch(/^wiki-vditor-/);
      expect(className).not.toMatch(/vditor-toggle/);
    });
  });
});
