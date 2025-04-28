# YouTube视频总结插件

一个强大的Chrome扩展，利用Gemini AI技术自动总结YouTube视频内容。

## 功能特点

- **快速总结**：一键获取YouTube视频的简洁摘要
- **详细笔记**：生成结构化的视频内容笔记，包括关键点和重要细节
- **Markdown格式**：支持将笔记下载为Markdown格式文件
- **自动检测**：自动识别当前标签页是否为YouTube视频页面

## 安装方法

### 从Chrome网上应用店安装

1. 访问Chrome网上应用店（链接待添加）
2. 点击"添加到Chrome"按钮

### 手动安装开发版本

1. 克隆此仓库：`git clone [仓库URL]`
2. 安装依赖：`pnpm install`
3. 添加`.env`文件并设置你的Google API密钥：`PLASMO_PUBLIC_GOOGLE_API_KEY=你的API密钥`
4. 构建扩展：`pnpm build`
5. 在Chrome中打开`chrome://extensions/`
6. 开启"开发者模式"
7. 点击"加载已解压的扩展程序"
8. 选择`build/chrome-mv3-dev`目录

## 使用方法

1. 访问任意YouTube视频页面
2. 点击浏览器工具栏中的扩展图标
3. 扩展将自动检测视频URL并提供摘要选项
4. 选择"快速总结"获取简短摘要，或"详细笔记"获取完整笔记
5. 点击"下载笔记"将详细笔记保存为Markdown文件

## 依赖技术

- [Plasmo框架](https://www.plasmo.com/)：用于Chrome扩展开发
- [Langchain](https://js.langchain.com/): AI链式工具集成
- [Google Gemini AI](https://developers.generativeai.google/): 先进的语言模型
- [React](https://reactjs.org/): 用户界面构建
- [TypeScript](https://www.typescriptlang.org/): 类型安全的JavaScript

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建生产版本
pnpm build
```

## 注意事项

- 使用此扩展需要有效的Google API密钥
- 摘要和笔记的质量取决于视频内容的清晰度和结构
- 此扩展仅用于教育和研究目的

## 许可证

MIT
