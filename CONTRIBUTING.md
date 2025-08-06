# 贡献指南

感谢您对 Confluence Enhance 项目的关注！我们欢迎各种形式的贡献。

## 🤝 如何贡献

### 报告问题

如果您发现了bug或有功能建议：

1. 首先搜索 [现有Issues](https://github.com/yourusername/confluence-enhance/issues) 确认问题未被报告
2. 使用相应的Issue模板创建新Issue
3. 提供详细的问题描述和复现步骤

### 提交代码

1. **Fork项目**
   ```bash
   # 在GitHub上Fork项目，然后克隆到本地
   git clone https://github.com/yourusername/confluence-enhance.git
   cd confluence-enhance
   ```

2. **创建分支**
   ```bash
   # 从main分支创建新的功能分支
   git checkout -b feature/your-feature-name
   # 或者修复分支
   git checkout -b fix/your-fix-name
   ```

3. **开发环境设置**
   ```bash
   # 安装依赖
   npm install
   
   # 启动开发服务器
   npm run dev
   ```

4. **编写代码**
   - 遵循项目的代码风格
   - 添加必要的注释
   - 确保代码通过ESLint检查

5. **测试**
   ```bash
   # 运行代码检查
   npm run lint
   
   # 构建项目
   npm run build
   
   # 测试构建结果
   npm test
   ```

6. **提交更改**
   ```bash
   # 添加更改
   git add .
   
   # 提交（使用有意义的提交信息）
   git commit -m "feat: add new toggle animation"
   ```

7. **推送并创建PR**
   ```bash
   # 推送到您的Fork
   git push origin feature/your-feature-name
   ```
   然后在GitHub上创建Pull Request

## 📝 代码规范

### JavaScript规范

- 使用ES6+语法
- 使用2个空格缩进
- 使用单引号
- 行末添加分号
- 变量名使用camelCase
- 常量使用UPPER_SNAKE_CASE

### CSS规范

- 使用2个空格缩进
- 类名使用kebab-case
- 属性按字母顺序排列
- 使用简写属性

### 提交信息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<类型>[可选的作用域]: <描述>

[可选的正文]

[可选的脚注]
```

类型包括：
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

示例：
```
feat: add dark theme support
fix: resolve toggle button positioning issue
docs: update README with new examples
```

## 🧪 测试

目前项目主要通过以下方式进行测试：

1. **代码检查**：ESLint自动检查代码质量
2. **构建测试**：确保代码能正确构建
3. **手动测试**：在实际Confluence环境中测试功能

我们计划在未来添加自动化测试。

## 📚 开发指南

### 项目结构

```
confluence-enhance/
├── src/                 # 源代码
│   ├── vditor-toggle.js # 主要JavaScript文件
│   └── vditor-toggle.css# 样式文件
├── dist/                # 构建输出（自动生成）
├── docs/                # 文档
├── examples/            # 使用示例
├── .github/             # GitHub配置
│   └── workflows/       # GitHub Actions
└── ...                  # 配置文件
```

### 构建流程

项目使用以下工具进行构建：

- **Terser**：JavaScript压缩
- **CleanCSS**：CSS压缩
- **ESLint**：代码质量检查

### 发布流程

1. 更新版本号：`npm version [patch|minor|major]`
2. 推送标签：`git push --follow-tags`
3. GitHub Actions自动构建和发布

## 🎯 开发重点

当前项目的主要发展方向：

1. **功能增强**
   - 添加更多主题选项
   - 支持自定义配置
   - 改进用户体验

2. **性能优化**
   - 减少文件大小
   - 优化加载速度
   - 改进内存使用

3. **兼容性**
   - 支持更多Confluence版本
   - 改进浏览器兼容性
   - 移动端优化

## ❓ 获取帮助

如果您在贡献过程中遇到问题：

1. 查看项目文档
2. 搜索现有Issues
3. 在Discussions中提问
4. 联系维护者

## 📄 许可证

通过贡献代码，您同意您的贡献将在MIT许可证下发布。

---

再次感谢您的贡献！🎉
