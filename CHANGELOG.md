# Change Log

## 2026-08-30 — Premium Motion & Interaction Pass

### Changed

- 为首屏建立分层入场节奏：定位、核心判断、解释、行动、证据与品牌视觉按阅读顺序出现。
- 为 Selected Work 增加克制的指针响应、媒体位移、文字推进与圆形箭头反馈。
- Case 首屏和真实项目图片加入轻量 Reveal 与滚动视差，不改变内容顺序。
- 全站阅读进度、导航当前状态与同源页面转场升级为渐进增强体验。
- 移动导航升级为完整不透明覆盖层，并修复 Header 模糊上下文导致的层级穿透。

### Accessibility & Performance

- 保留原生滚动，不使用 scroll-jacking。
- 动画优先使用 transform 与 opacity，并限制在桌面精细指针环境。
- `prefers-reduced-motion` 下关闭位移和转场；外部动效库加载失败时回退到原有 IntersectionObserver Reveal。
- GSAP 与 ScrollTrigger 固定为 3.15.0，避免未锁版本造成未来表现漂移。

## 2026-08-30 — Product Marketing Portfolio System

### Changed

- 保留「第八轨道」品牌与 `Turning judgment into systems.`，将首页从单一作品展示升级为长期可维护的求职作品集入口。
- 将首页定位收束为 Product Marketing、GTM、User Insight、Marketing Strategy 与 AI-enabled Workflow。
- 使用接近 Apple 官网的信息设计原则：更少装饰、更强标题层级、克制冰蓝、精确留白与轻微动效。
- Resume 由旧静态入口升级为在线摘要页，并保留根目录 `resume.pdf` 的兼容 URL。
- SEO、Open Graph、favicon、sitemap、robots 和 404 页面统一更新。

### Added

- 5 个完整或轻量 Case 页面：vivo X Fold6、造浪局、Insta360 Ace Pro、Market & Consumer Insight、Marketing & Experience Projects。
- vivo 产品能力到用户价值 Framework、Launch Workflow 与公开结果边界。
- 造浪局真实产品截图、Live Product 入口和当前功能边界。
- Insta360 招聘笔试 Case 与完整原稿下载入口。
- How I Think、Experience、AI & Tools 与 Contact 体系。
- 11 页 Product Marketing Portfolio PDF 与 1 页通用 Resume PDF。
- 结构化内容层、构建脚本、检查脚本、PDF 生成脚本和维护文档。

### Removed

- “唯一作品”的站点叙事。
- 已废弃且不再被页面引用的旧 CSS / JavaScript 入口。
- 工具 Logo 墙、模板化校招首页和虚构量化结果的方向。

### Content Safety

- vivo Case 不公开内部聊天、源文件、销量、GMV、后台、用户数据、内部商业策略或供应商信息。
- 未添加虚构用户研究、样本量、传播曝光、转化或商业结果。
- Insta360 明确标注为 `Recruitment Assessment / Independent Strategy Case`，不包装成任职或客户项目。
