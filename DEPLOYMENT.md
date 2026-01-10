# 部署说明

本项目已经配置好，可以轻松开源到 GitHub 并让其他人访问。

## 已完成配置

### 1. Package.json 配置
- ✅ 添加了 `repository` 字段，指向 GitHub 仓库
- ✅ 添加了 `homepage` 字段，指向 GitHub Pages 地址
- ✅ 添加了 `bugs` 字段，指向 GitHub Issues

### 2. GitHub Pages 自动部署
- ✅ 创建了 `.github/workflows/deploy.yml` 工作流
- ✅ 配置了自动构建和部署到 GitHub Pages
- ✅ 更新了 `vite.config.js` 支持 GitHub Pages 的 base 路径

### 3. README 更新
- ✅ 添加了在线演示链接
- ✅ 添加了 GitHub 仓库链接
- ✅ 添加了 NPM 包链接

## 发布步骤

### 第一步：发布到 GitHub

1. 确保 GitHub 仓库是公开的（Public）
2. 将代码推送到 GitHub：
```bash
git add .
git commit -m "Initial commit: Add SignUpSource component"
git remote add origin https://github.com/opengspace/SignUpSource.git
git push -u origin main
```

3. 在 GitHub 仓库设置中启用 GitHub Pages：
   - 进入 Settings → Pages
   - Source 选择 "GitHub Actions"
   - 保存设置

### 第二步：发布到 NPM（可选但推荐）

1. 确保已经登录 npm：
```bash
npm login
```

2. 确保包名在 npm 上可用（`@opengspace/signupsource`）

3. 构建并发布：
```bash
npm run build:lib
npm publish --access public
```

注意：首次发布需要使用 `--access public` 因为这是 scoped package。

### 第三步：验证

1. **GitHub Pages 在线演示**：
   - 访问：https://opengspace.github.io/SignUpSource
   - 通常在推送代码后几分钟内自动部署

2. **NPM 包**：
   - 访问：https://www.npmjs.com/package/@opengspace/signupsource
   - 验证可以正常安装：`npm install @opengspace/signupsource`

3. **CDN 链接**：
   - 发布到 npm 后，CDN 链接会自动可用
   - 地址：https://cdn.jsdelivr.net/npm/@opengspace/signupsource@latest/dist/signupsource.umd.js

## 访问方式总结

项目开源后，用户可以通过以下方式访问和使用：

1. **在线演示**：https://opengspace.github.io/SignUpSource
   - 直接体验功能，无需安装

2. **NPM 安装**：
   ```bash
   npm install @opengspace/signupsource
   ```

3. **CDN 使用**：
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@opengspace/signupsource@latest/dist/signupsource.umd.js"></script>
   ```

4. **GitHub 源码**：
   - 查看源代码、提 Issue、提交 PR

## 注意事项

1. **首次部署 GitHub Pages**：
   - 推送代码后，GitHub Actions 会自动运行
   - 等待几分钟后访问在线演示链接
   - 如果失败，检查 Actions 标签页的错误信息

2. **NPM 发布**：
   - 每次发布新版本时，更新 `package.json` 中的 `version`
   - 使用语义化版本号（如 0.1.0 → 0.1.1）

3. **CDN 更新**：
   - npm 发布后，CDN 需要几分钟同步
   - 使用 `@latest` 标签会自动指向最新版本

## 后续更新

- 代码更新后推送到 main 分支会自动部署到 GitHub Pages
- 更新版本后需要重新发布到 npm 才能通过 CDN 访问

