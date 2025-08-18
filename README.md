# Confluence Enhance

[![Build Status](https://github.com/scutken/confluence-enhance/workflows/Build%20and%20Release/badge.svg)](https://github.com/scutken/confluence-enhance/actions)
[![jsDelivr](https://data.jsdelivr.com/v1/package/gh/scutken/confluence-enhance/badge)](https://www.jsdelivr.com/package/gh/scutken/confluence-enhance)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个用于增强Confluence页面的JavaScript工具集。当前包含Wiki Vditor功能，提供Markdown渲染切换功能。通过jsDelivr CDN全球分发，让您的Confluence页面支持更好的Markdown显示效果。

## ✨ 特性

- 🚀 **单文件部署**：独立版本包含所有依赖，真正的一键部署
- 🔄 **一键切换**：在原始Markdown文本和Vditor渲染效果之间轻松切换
- 📊 **Mermaid支持**：完美渲染流程图、时序图等图表，支持点击放大
- 🔍 **SVG交互**：支持SVG图表的缩放、拖拽和重置功能
- 🧮 **数学公式**：支持KaTeX数学公式渲染
- 🎨 **代码高亮**：GitHub风格的代码语法高亮
- 📝 **大纲导航**：自动生成文档大纲，支持折叠和跳转
- 🎯 **零配置**：开箱即用，无需复杂配置
- 📱 **响应式设计**：适配各种屏幕尺寸
- 🌍 **全球CDN**：基于jsDelivr提供快速稳定的全球访问

## 🚀 快速开始

**🎉 单文件部署，无需额外依赖！**

### CDN引入（推荐）

```html
<!-- 只需引入一个文件，包含所有功能 -->
<script src="https://cdn.jsdelivr.net/gh/scutken/confluence-enhance@latest/dist/wiki-vditor.min.js"></script>
```

### 指定版本引入

为了确保稳定性，建议指定具体版本：

```html
<!-- 使用具体版本 -->
<script src="https://cdn.jsdelivr.net/gh/scutken/confluence-enhance@v1.2.0/dist/wiki-vditor.min.js"></script>
```

### 本地部署

```html
<!-- 下载文件到本地使用 -->
<script src="path/to/wiki-vditor.min.js"></script>
```

### 其他CDN选项

```html
<!-- unpkg CDN -->
<script src="https://unpkg.com/confluence-enhance@1/dist/wiki-vditor.min.js"></script>

<!-- 国内CDN（如果可用） -->
<script src="https://cdn.bootcdn.net/ajax/libs/confluence-enhance/1.0.0/wiki-vditor.min.js"></script>
```

## 📖 使用说明

### 基本用法

1. 确保您的Confluence页面包含带有 `data-macro-name='noformat'` 属性的Markdown内容块
2. 引入必要的CSS和JavaScript文件
3. 工具会自动检测页面内容并创建所需的DOM元素（切换按钮和渲染容器）
4. 无需手动添加任何HTML结构，一切都由JavaScript自动处理

**注意：** 从v1.1.0版本开始，您不再需要在页面中预先添加 `.vditor-toggle-container` 和 `#vditor-content` 元素，工具会自动创建这些必需的DOM结构。

## 💡 核心优势

- **🚀 极简部署**：只需一个JS文件，无需额外依赖
- **📦 完整功能**：内嵌Vditor 3.11.1，支持所有Markdown功能
- **🎯 零配置**：自动检测并初始化，无需手动设置
- **🔒 版本锁定**：避免外部依赖版本冲突问题
- **⚡ 高性能**：压缩后仅348KB，加载快速

### 高级配置

如果需要自定义配置，可以在引入脚本后进行设置：

```javascript
// 自定义Vditor配置
window.WikiVditor.config = {
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
- Bun >= 1.0.0 (推荐)

### 快速开始

```bash
# 克隆项目
git clone https://github.com/scutken/confluence-enhance.git
cd confluence-enhance

# 安装依赖
bun install

# 构建项目
bun run build

# 启动开发服务器（查看演示）
bun run dev
```

### 项目结构

```text
confluence-enhance/
├── src/                          # 源代码
│   ├── wiki-vditor.js           # Wiki Vditor核心功能
│   └── wiki-vditor.css          # Wiki Vditor样式
├── scripts/                     # 构建和开发脚本
│   ├── build.js                 # 构建脚本
│   ├── dev.js                   # 开发服务器脚本
│   ├── serve.js                 # HTTP服务器脚本
│   └── clean.js                 # 清理脚本
├── dist/                        # 构建输出
│   ├── wiki-vditor.js           # 开发版本
│   └── wiki-vditor.min.js       # 生产版本
├── examples/                    # 演示和测试
│   ├── demo.html               # 完整功能演示
│   └── test-standalone.html    # 功能测试
└── docs/                       # 项目文档
```

### 可用脚本

```bash
# 构建项目
bun run build

# 开发模式（构建 + 启动服务器 + 显示演示页面）
bun run dev

# 仅启动HTTP服务器
bun run serve

# 清理构建文件
bun run clean
```

### 构建流程

1. **读取依赖**：自动读取Vditor库文件和样式
2. **代码合并**：将所有代码合并到单一文件
3. **样式注入**：CSS样式自动内嵌到JavaScript中
4. **代码压缩**：生成优化的生产版本

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

- `@v1` - 主版本最新（推荐生产环境）
- `@v1.0.0` - 指定版本（最稳定）
- `@latest` - 最新版本（不推荐生产环境）

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
