# Confluence Enhance

[![Build Status](https://github.com/scutken/confluence-enhance/workflows/Build%20and%20Release/badge.svg)](https://github.com/scutken/confluence-enhance/actions)
[![jsDelivr](https://data.jsdelivr.com/v1/package/gh/scutken/confluence-enhance/badge)](https://www.jsdelivr.com/package/gh/scutken/confluence-enhance)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个用于增强Confluence页面的JavaScript工具，提供Vditor Markdown渲染切换功能。通过jsDelivr CDN全球分发，让您的Confluence页面支持更好的Markdown显示效果。

## ✨ 特性

- 🔄 **一键切换**：在原始Markdown文本和Vditor渲染效果之间轻松切换
- 🎨 **美观渲染**：支持数学公式、代码高亮、目录生成等丰富功能
- 🚀 **即插即用**：通过CDN引入，无需复杂配置
- 📱 **响应式设计**：适配各种屏幕尺寸
- 🌍 **全球CDN**：基于jsDelivr提供快速稳定的全球访问

## 🚀 快速开始

### 通过CDN引入（推荐）

在您的Confluence页面中添加以下代码：

```html
<!-- 引入CSS样式 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/scutken/confluence-enhance@latest/dist/vditor-toggle.min.css">

<!-- 引入Vditor依赖 -->
<script src="https://cdn.jsdelivr.net/npm/vditor@3/dist/index.min.js"></script>

<!-- 引入本工具 -->
<script src="https://cdn.jsdelivr.net/gh/scutken/confluence-enhance@latest/dist/vditor-toggle.min.js"></script>

<!-- 页面结构 -->
<div class="vditor-toggle-container">
  <button id="toggleVditorBtn" class="vditor-toggle-btn">显示 Vditor 渲染</button>
</div>
<div id="vditor-content"></div>
```

### 指定版本引入

为了确保稳定性，建议指定具体版本：

```html
<!-- 使用特定版本 -->
<script src="https://cdn.jsdelivr.net/gh/scutken/confluence-enhance@v1.0.0/dist/vditor-toggle.min.js"></script>
```

### 其他CDN选项

```html
<!-- unpkg CDN -->
<script src="https://unpkg.com/confluence-enhance@latest/dist/vditor-toggle.min.js"></script>

<!-- 国内CDN（如果可用） -->
<script src="https://cdn.bootcdn.net/ajax/libs/confluence-enhance/1.0.0/vditor-toggle.min.js"></script>
```

## 📖 使用说明

### 基本用法

1. 确保您的Confluence页面包含带有 `data-macro-name='noformat'` 属性的Markdown内容块
2. 引入必要的CSS和JavaScript文件
3. 工具会自动检测页面内容并添加切换功能

### 高级配置

如果需要自定义配置，可以在引入脚本后进行设置：

```javascript
// 自定义Vditor配置
window.VditorToggle.config = {
  theme: 'dark',
  lang: 'en_US',
  math: {
    engine: 'MathJax'
  }
};
```

## 🛠️ 开发

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

### 本地开发

```bash
# 克隆项目
git clone https://github.com/scutken/confluence-enhance.git
cd confluence-enhance

# 安装依赖
npm install

# 构建项目
npm run build

# 启动开发服务器
npm run dev
```

### 构建命令

```bash
# 构建所有文件
npm run build

# 只构建JavaScript
npm run build:js

# 只构建CSS
npm run build:css

# 代码检查
npm run lint

# 修复代码格式
npm run lint:fix
```

## 📦 版本发布

项目使用语义化版本控制：

```bash
# 发布补丁版本 (1.0.0 -> 1.0.1)
npm run release

# 发布次要版本 (1.0.0 -> 1.1.0)
npm run release:minor

# 发布主要版本 (1.0.0 -> 2.0.0)
npm run release:major
```

## 🌐 jsDelivr CDN 使用

### 版本选择

- `@latest` - 最新版本（不推荐生产环境）
- `@v1.0.0` - 指定版本（推荐）
- `@v1` - 主版本最新（较安全）

### 缓存策略

jsDelivr提供以下缓存选项：

- 默认缓存：7天
- 永久缓存：使用具体版本号
- 强制刷新：在URL后添加 `?t=timestamp`

## 🤝 贡献

欢迎贡献代码！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详细信息。

### 贡献流程

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [Vditor 官方文档](https://ld246.com/article/1549638745630)
- [jsDelivr CDN](https://www.jsdelivr.com/)
- [Confluence 开发文档](https://developer.atlassian.com/cloud/confluence/)

## 📞 支持

如果您遇到问题或有建议，请：

1. 查看 [FAQ](docs/FAQ.md)
2. 搜索 [Issues](https://github.com/scutken/confluence-enhance/issues)
3. 创建新的 Issue

---

⭐ 如果这个项目对您有帮助，请给我们一个星标！
