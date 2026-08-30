# 第八轨道 / Shawn Li Portfolio

李翔的长期求职作品集系统，面向 Product Marketing、GTM、Consumer Insight、Marketing Strategy 与 AI-enabled Workflow。网站、Case Study 与 Portfolio PDF 使用同一套内容架构；「造浪局」保持为独立 Live Product。

线上地址：<https://shawn-cyber666.github.io/shawn-portfolio/>

## 项目结构

```text
content/site-data.mjs             网站唯一结构化内容源
scripts/build.mjs                 生成首页、Case、Resume 与 SEO 文件
scripts/dev-server.mjs            本地静态预览
scripts/check.mjs                 内容与生成文件检查
scripts/create-pdfs.py            生成 Portfolio / Resume PDF
assets/styles/site.css            设计系统与响应式样式
assets/scripts/site.js            导航、Reveal、目录与进度交互
assets/cases/                     Case 真实截图
assets/documents/                 可下载 Portfolio 与策略原稿
cases/<slug>/index.html           构建生成的 Case 页面
resume/index.html                 在线 Resume
resume.pdf                        通用 Product Marketing Resume
```

## 本地运行

不需要安装第三方前端依赖。

```bash
npm run build
npm run check
npm run dev
```

打开终端输出的本地地址即可预览。修改内容后重新运行 `npm run build`。

## 更新或新增 Case

1. 在 `content/site-data.mjs` 的 `cases` 数组中编辑或新增对象。
2. 新 Case 至少填写 `order`、`slug`、`title`、`type`、`summary`、`hero`、`sections` 与 `disclosure`。
3. 把真实图片放入 `assets/cases/<slug>/`，并在 Case 数据中写相对路径。
4. 运行 `npm run build && npm run check`。
5. 检查桌面端与手机端，确认无图片裁切、表格溢出和链接错误。

新增 Case 不需要复制页面模板；构建脚本会自动生成路由、首页入口、Next Case 与 sitemap。

## 调整 Case 顺序

直接调整 `content/site-data.mjs` 中 `cases` 的数组顺序和 `order`。首页、Case 跳转与 sitemap 会同步更新。

## 替换 Resume

- 在线 Resume 内容由 `scripts/build.mjs` 与 `content/site-data.mjs` 生成。
- 可下载版本固定为根目录 `resume.pdf`，保持旧公开 URL 不变。
- 生成新版通用 Resume 后覆盖该文件，再运行 `npm run check`。

## 生成 PDF

需要 Python 及 `reportlab`、`Pillow`。

```bash
python3 scripts/create-pdfs.py
```

脚本会生成：

- `dist/pdf/李翔-Product-Marketing-Portfolio.pdf`
- `dist/pdf/李翔-Product-Marketing-Resume.pdf`

并同步更新网站中的 `assets/documents/li-xiang-product-marketing-portfolio.pdf` 与 `resume.pdf`。生成后应把 PDF 渲染为图片逐页检查。

## 部署 GitHub Pages

```bash
npm run build
npm run check
git add .
git commit -m "Upgrade product marketing portfolio"
git push origin main
```

仓库继续使用原有 GitHub Pages 项目路径 `/shawn-portfolio/`，不要改成根域名绝对资源路径。

## 内容与保密原则

- 不添加未经证实的销量、GMV、曝光、转化或样本量。
- vivo Case 只使用官方公开素材、职责描述与本人重绘方法。
- Insta360 Case 必须保留 `Recruitment Assessment / Independent Strategy Case` 标签。
- 工具与 AI 只描述当前真实功能和本人实际使用方式。
- 新增公开素材时同步更新 `ASSET-INVENTORY.md`。
