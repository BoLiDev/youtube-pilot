# YouTube 视频摘要工具

这是一个 Chrome 扩展，利用 Google Gemini AI 和 Langchain 框架快速生成 YouTube 视频内容的摘要和详细笔记。

## 功能

- **快速摘要**：在 YouTube 视频页面上，一键获取当前视频的简短摘要
- **详细笔记**：输入任何 YouTube 视频的 URL，生成结构化的详细笔记
- **Markdown 下载**：将生成的笔记以 Markdown 格式下载，便于保存和分享
- **缓存支持**：自动缓存生成的摘要和笔记，提高使用体验和减少 API 调用

## 安装指南

### 开发环境设置

1. 克隆仓库：
   ```bash
   git clone https://github.com/yourusername/youtube-summerizer-plugin.git
   cd youtube-summerizer-plugin
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 创建 `.env` 文件并添加你的 Google API 密钥：
   ```
   PLASMO_PUBLIC_GOOGLE_API_KEY=your-api-key-here
   ```

4. 启动开发服务器：
   ```bash
   npm run dev
   ```

5. 在 Chrome 扩展管理页面加载扩展：
   - 打开 `chrome://extensions/`
   - 开启"开发者模式"
   - 点击"加载已解压的扩展"
   - 选择 `build/chrome-mv3-dev` 目录

### 构建生产版本

构建生产版本的扩展：
```bash
npm run build
```

生产版本将在 `build/chrome-mv3-prod` 目录中生成。

## 使用方法

1. **获取当前视频摘要**：
   - 在任何 YouTube 视频页面上点击扩展图标
   - 点击"获取快速摘要"按钮
   - 查看生成的摘要内容

2. **生成详细笔记**：
   - 点击扩展图标
   - 在输入框中粘贴 YouTube 视频链接
   - 点击"生成笔记"按钮
   - 查看生成的 Markdown 格式笔记
   - 可以使用"下载笔记"按钮保存笔记到本地

## 技术栈

- **扩展框架**：Plasmo
- **AI 框架**：Langchain
- **LLM 模型**：gemini-2.0-flash
- **语言**：TypeScript
- **UI 库**：React

## 隐私说明

此扩展仅处理 YouTube 视频 URL，不会收集任何个人数据。所有 API 调用均在本地设备上完成，确保用户数据隐私。
