# 常见问题解答 (FAQ)

## 🚀 安装和使用

### Q: 如何在Confluence中使用这个工具？

A: 有两种主要方式：

1. **通过用户脚本管理器**（推荐）：
   - 安装Tampermonkey或Greasemonkey
   - 创建新脚本，引入我们的CSS和JS文件
   - 脚本会在所有Confluence页面自动运行

2. **通过页面HTML**：
   - 在Confluence页面的HTML源码中添加引入代码
   - 需要管理员权限或页面编辑权限

### Q: 支持哪些版本的Confluence？

A: 本工具主要针对Confluence Cloud和Server版本设计，理论上支持：
- Confluence Cloud（所有版本）
- Confluence Server 6.0+
- Confluence Data Center 6.0+

### Q: 是否需要安装Vditor？

A: 是的，本工具依赖Vditor进行Markdown渲染。您需要：
```html
<script src="https://cdn.jsdelivr.net/npm/vditor@3/dist/index.min.js"></script>
```

## 🔧 配置和自定义

### Q: 如何自定义主题？

A: 可以通过修改Vditor配置来自定义主题：

```javascript
// 在引入脚本后添加配置
window.VditorToggle.config = {
  theme: {
    current: 'dark' // 或 'light'
  }
};
```

### Q: 如何修改按钮样式？

A: 可以通过CSS覆盖默认样式：

```css
.vditor-toggle-btn {
  background-color: #28a745 !important;
  border-radius: 8px !important;
}
```

### Q: 支持哪些数学公式引擎？

A: 支持KaTeX和MathJax：

```javascript
window.VditorToggle.config = {
  math: {
    engine: 'KaTeX', // 或 'MathJax'
    inlineDigit: true
  }
};
```

## 🐛 故障排除

### Q: 按钮不显示怎么办？

A: 请检查以下几点：

1. **确认页面结构**：页面必须包含带有 `data-macro-name='noformat'` 属性的元素
2. **检查控制台错误**：打开浏览器开发者工具查看是否有JavaScript错误
3. **确认依赖加载**：确保Vditor库已正确加载
4. **检查CSS加载**：确认样式文件已正确引入

### Q: 渲染效果不正确怎么办？

A: 可能的原因和解决方案：

1. **Markdown格式问题**：检查原始Markdown语法是否正确
2. **Vditor版本兼容性**：尝试使用不同版本的Vditor
3. **CSS冲突**：检查是否有其他样式影响渲染效果

### Q: 在某些页面不工作？

A: 这通常是因为：

1. **页面结构不匹配**：工具寻找特定的DOM结构
2. **动态加载内容**：如果内容是异步加载的，可能需要手动初始化
3. **权限限制**：某些Confluence配置可能限制JavaScript执行

解决方案：
```javascript
// 手动初始化
if (window.VditorToggle) {
  window.VditorToggle.setup();
}
```

## 🌐 CDN和性能

### Q: 哪个CDN最快？

A: 推荐使用顺序：

1. **jsDelivr**（推荐）：全球CDN，速度快，稳定性好
2. **unpkg**：备选方案，基于npm
3. **本地部署**：如果有特殊需求

### Q: 如何确保版本稳定性？

A: 建议使用具体版本号而不是`@latest`：

```html
<!-- 推荐：指定版本 -->
<script src="https://cdn.jsdelivr.net/gh/yourusername/confluence-enhance@v1.0.0/dist/vditor-toggle.min.js"></script>

<!-- 不推荐：使用latest -->
<script src="https://cdn.jsdelivr.net/gh/yourusername/confluence-enhance@latest/dist/vditor-toggle.min.js"></script>
```

### Q: 文件大小是多少？

A: 压缩后的文件大小：
- JavaScript: ~3KB (gzipped)
- CSS: ~1KB (gzipped)

## 🔄 更新和维护

### Q: 如何获取更新通知？

A: 可以通过以下方式：

1. **GitHub Watch**：在项目页面点击Watch按钮
2. **Release订阅**：订阅GitHub Releases
3. **定期检查**：查看CHANGELOG.md了解更新内容

### Q: 如何报告问题？

A: 请通过以下方式报告问题：

1. **GitHub Issues**：在项目页面创建Issue
2. **提供详细信息**：包括浏览器版本、Confluence版本、错误信息等
3. **复现步骤**：详细描述如何重现问题

## 🤝 贡献和开发

### Q: 如何参与开发？

A: 欢迎贡献！请查看 [CONTRIBUTING.md](../CONTRIBUTING.md) 了解详细信息。

### Q: 如何本地测试？

A: 开发环境设置：

```bash
git clone https://github.com/yourusername/confluence-enhance.git
cd confluence-enhance
npm install
npm run dev
```

### Q: 如何提交功能请求？

A: 请在GitHub Issues中：

1. 使用"Feature Request"模板
2. 详细描述需求和使用场景
3. 说明预期的实现方式

---

## 📞 获取更多帮助

如果以上FAQ没有解决您的问题，请：

1. 搜索 [GitHub Issues](https://github.com/yourusername/confluence-enhance/issues)
2. 查看 [项目文档](../README.md)
3. 创建新的Issue描述您的问题

我们会尽快回复并提供帮助！
