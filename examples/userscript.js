// ==UserScript==
// @name         Confluence Vditor Toggle
// @namespace    https://github.com/scutken/confluence-enhance
// @version      1.0.0
// @description  在Confluence页面中添加Vditor Markdown渲染切换功能
// @author       Your Name
// @match        https://your-confluence-domain.com/*
// @match        https://*.atlassian.net/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/vditor@3/dist/index.min.js
// @resource     VditorCSS https://cdn.jsdelivr.net/npm/vditor@3/dist/index.css
// @resource     ToggleCSS https://cdn.jsdelivr.net/gh/scutken/confluence-enhance@latest/dist/vditor-toggle.min.css
// ==/UserScript==

(function() {
    'use strict';
    
    // 加载CSS样式
    function loadCSS(url) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
    }
    
    // 加载Vditor CSS
    loadCSS('https://cdn.jsdelivr.net/npm/vditor@3/dist/index.css');
    
    // 加载Toggle CSS
    loadCSS('https://cdn.jsdelivr.net/gh/scutken/confluence-enhance@latest/dist/vditor-toggle.min.css');
    
    // 等待页面加载完成
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            setTimeout(() => waitForElement(selector, callback), 100);
        }
    }
    
    // 初始化函数
    function initVditorToggle() {
        // 查找包含Markdown内容的元素
        const markdownElements = document.querySelectorAll('.conf-macro.output-block[data-macro-name="noformat"]');
        
        markdownElements.forEach((element, index) => {
            // 为每个Markdown块创建独立的切换功能
            const containerId = `vditor-content-${index}`;
            const buttonId = `toggleVditorBtn-${index}`;
            
            // 创建切换按钮容器
            const toggleContainer = document.createElement('div');
            toggleContainer.className = 'vditor-toggle-container';
            toggleContainer.innerHTML = `
                <button id="${buttonId}" class="vditor-toggle-btn">显示 Vditor 渲染</button>
            `;
            
            // 创建Vditor内容容器
            const vditorContainer = document.createElement('div');
            vditorContainer.id = containerId;
            vditorContainer.style.display = 'none';
            
            // 插入到页面中
            element.parentNode.insertBefore(toggleContainer, element);
            element.parentNode.insertBefore(vditorContainer, element.nextSibling);
            
            // 设置切换功能
            setupToggle(element, vditorContainer, document.getElementById(buttonId));
        });
    }
    
    // 设置切换功能
    function setupToggle(markdownElement, vditorContainer, toggleButton) {
        const markdown = markdownElement.textContent.trim();
        let isVditorView = false;
        
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
        
        function toggleView() {
            isVditorView = !isVditorView;
            if (isVditorView) {
                markdownElement.style.display = 'none';
                vditorContainer.style.display = 'block';
                toggleButton.textContent = '显示 Markdown 原文';
                initVditorPreview();
            } else {
                vditorContainer.style.display = 'none';
                markdownElement.style.display = '';
                toggleButton.textContent = '显示 Vditor 渲染';
            }
        }
        
        toggleButton.addEventListener('click', toggleView);
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVditorToggle);
    } else {
        initVditorToggle();
    }
    
    // 监听页面变化（适用于SPA应用）
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                // 检查是否有新的Markdown内容添加
                const newMarkdownElements = document.querySelectorAll('.conf-macro.output-block[data-macro-name="noformat"]:not([data-vditor-processed])');
                if (newMarkdownElements.length > 0) {
                    setTimeout(initVditorToggle, 500);
                }
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
})();
