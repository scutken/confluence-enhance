(function() {
  'use strict';
  
  // 避免重复加载
  if (window.VditorToggle) return;
  
  window.VditorToggle = {
    init: function() {
      document.addEventListener('DOMContentLoaded', function () {
        VditorToggle.setup();
      });
    },
    
    setup: function() {
      // 获取原始markdown文本块
      const pre = document.querySelector(
        '.conf-macro.output-block[data-macro-name=\'noformat\']'
      );
      const vditorContainer = document.getElementById('vditor-content');
      const toggleBtn = document.getElementById('toggleVditorBtn');
      const markdown = pre ? pre.textContent.trim() : '';
      let isVditorView = true;

      // 初始化渲染
      function initVditorPreview() {
        if (markdown && !vditorContainer.hasChildNodes()) {
          Vditor.preview(vditorContainer, markdown, {
            markdown: {
              toc: true,
              mark: true,
              footnotes: true,
              autoSpace: true,
            },
            math: {
              engine: 'KaTeX',
              inlineDigit: true,
            },
            hljs: {
              style: 'github',
              lineNumber: true,
            },
            anchor: 2,
            lang: 'zh_CN',
            theme: {
              current: 'light',
            },
          });
        }
      }

      // 切换显示逻辑
      function toggleView() {
        isVditorView = !isVditorView;
        if (isVditorView) {
          pre.style.display = 'none';
          vditorContainer.style.display = 'block';
          toggleBtn.textContent = '显示 Markdown 原文';
          initVditorPreview();
        } else {
          vditorContainer.style.display = 'none';
          pre.style.display = '';
          toggleBtn.textContent = '显示 Vditor 渲染';
        }
      }

      if (pre) {
        // 将按钮插入到原文内容元素的上方
        pre.parentNode.insertBefore(document.querySelector('#toggleVditorBtn').parentNode, pre);
        
        toggleBtn.addEventListener('click', toggleView);
        
        // 默认设置：隐藏原文，显示渲染
        pre.style.display = 'none';
        vditorContainer.style.display = 'block';
        initVditorPreview();
      } else {
        toggleBtn.style.display = 'none';
      }
    }
  };
  
  // 自动初始化
  VditorToggle.init();
})();
