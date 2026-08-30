import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { site, capabilityChain, experience, toolWorkflow, cases } from "../content/site-data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicBase = "/shawn-portfolio/";

const esc = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const rel = (depth) => depth === 0 ? "./" : "../".repeat(depth);
const href = (value, depth) => {
  if (!value) return "#";
  if (/^(https?:|mailto:|tel:|#)/.test(value)) return value;
  return `${rel(depth)}${value}`;
};
const external = (value = "") => /^https?:/.test(value);

async function output(path, content) {
  const absolute = resolve(root, path);
  await mkdir(dirname(absolute), { recursive: true });
  await writeFile(absolute, content.trimStart(), "utf8");
}

function icon(name) {
  return `<i class="ph ph-${name}" aria-hidden="true"></i>`;
}

function action(label, url, depth, variant = "primary") {
  const target = external(url) ? ' target="_blank" rel="noreferrer"' : "";
  return `<a class="button button--${variant}" href="${esc(href(url, depth))}"${target} data-magnetic><span>${esc(label)}</span>${icon(external(url) ? "arrow-up-right" : "arrow-right")}</a>`;
}

function metadata({ title, description, path = "", image = "assets/og-portfolio.jpg" }) {
  const canonical = `${site.website}${path}`;
  const og = `${site.website}${image}`;
  return `
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}">
    <link rel="canonical" href="${esc(canonical)}">
    <meta name="theme-color" content="#030609">
    <meta name="color-scheme" content="dark">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(description)}">
    <meta property="og:url" content="${esc(canonical)}">
    <meta property="og:image" content="${esc(og)}">
    <meta name="twitter:card" content="summary_large_image">`;
}

function header(depth, active = "") {
  const home = rel(depth);
  const nav = [
    ["Work", `${home}#work`, "work"],
    ["Thinking", `${home}#thinking`, "thinking"],
    ["Experience", `${home}#experience`, "experience"],
    ["About", `${home}#about`, "about"],
    ["Resume", `${home}resume/`, "resume"],
    ["Contact", `${home}#contact`, "contact"]
  ];
  return `<header class="site-header" data-header>
    <a class="brand" href="${home}" aria-label="${esc(site.brand)} 首页" data-magnetic>
      <span class="brand__mark" aria-hidden="true">08</span>
      <span class="brand__name">${esc(site.brand)}</span>
    </a>
    <nav class="desktop-nav" aria-label="Primary navigation">
      ${nav.map(([label, url, key]) => `<a href="${url}" data-nav-link="${key}"${active === key ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
    </nav>
    <button class="menu-button" type="button" aria-expanded="false" aria-controls="mobile-navigation" data-menu-button>
      <span class="sr-only">打开导航</span>
      <i class="ph ph-list" aria-hidden="true"></i>
    </button>
    <nav class="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation" data-mobile-nav>
      ${nav.map(([label, url]) => `<a href="${url}">${label}</a>`).join("")}
    </nav>
  </header>`;
}

function footer(depth) {
  return `<footer class="site-footer">
    <div>
      <span class="footer-brand">${esc(site.brand)} / ${esc(site.englishName)}</span>
      <p>${esc(site.hero.statement)}</p>
    </div>
    <div class="footer-links">
      <a href="mailto:${esc(site.email)}">Email</a>
      <a href="${esc(site.github)}" target="_blank" rel="noreferrer">GitHub</a>
      <a href="${rel(depth)}assets/documents/li-xiang-product-marketing-portfolio.pdf">Portfolio PDF</a>
      <a href="${rel(depth)}resume/">Resume</a>
    </div>
    <p class="footer-note">© ${new Date().getFullYear()} ${esc(site.englishName)}. Built as a living portfolio system.</p>
  </footer>`;
}

function shell({ title, description, body, depth = 0, active = "", path = "", pageClass = "" }) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script>document.documentElement.classList.add("js")</script>
  ${metadata({ title, description, path })}
  <link rel="icon" href="${rel(depth)}assets/avatar.png" type="image/png">
  <link rel="preconnect" href="https://unpkg.com">
  <link rel="preconnect" href="https://cdn.jsdelivr.net">
  <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css">
  <link rel="stylesheet" href="${rel(depth)}assets/styles/site.css">
</head>
<body class="${esc(pageClass)}">
  <a class="skip-link" href="#main">跳到主要内容</a>
  <div class="reading-progress" data-progress aria-hidden="true"></div>
  ${header(depth, active)}
  <main id="main">${body}</main>
  ${footer(depth)}
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollTrigger.min.js" defer></script>
  <script src="${rel(depth)}assets/scripts/site.js" defer></script>
</body>
</html>`;
}

function caseRow(item, index) {
  return `<article class="work-row reveal" data-work-row>
    <a class="work-row__link" href="cases/${esc(item.slug)}/" aria-label="查看 ${esc(item.title)} Case Study">
      <div class="work-row__index">${esc(item.order)}</div>
      <div class="work-row__copy">
        <div class="work-row__meta"><span>${esc(item.type)}</span><span>${esc(item.year)}</span></div>
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.summary)}</p>
        <ul class="tag-list" aria-label="能力标签">${item.capabilities.map(tag => `<li>${esc(tag)}</li>`).join("")}</ul>
      </div>
      <figure class="work-row__media" data-hover-media>
        <img src="${href(item.hero.src, 0)}" alt="${esc(item.hero.alt)}" loading="${index < 2 ? "eager" : "lazy"}">
      </figure>
      <span class="work-row__arrow">${icon("arrow-up-right")}</span>
    </a>
  </article>`;
}

function homePage() {
  const featured = cases.filter(item => item.featured);
  const lightweight = cases.filter(item => !item.featured);
  const heroTitle = site.hero.title.split("\n").map(line => `<span class="hero-title__line"><span>${esc(line)}</span></span>`).join("");
  const body = `
    <section class="hero section-pad" aria-labelledby="hero-title">
      <div class="hero__copy reveal" data-hero-copy>
        <p class="eyebrow" data-hero-item>${esc(site.hero.eyebrow)}</p>
        <h1 id="hero-title" data-hero-title>${heroTitle}</h1>
        <p class="hero__body" data-hero-item>${esc(site.hero.body)}</p>
        <div class="hero__actions" data-hero-item>
          ${action("View Selected Work", "#work", 0)}
          ${action("Resume", "resume/", 0, "secondary")}
          ${action("Contact", `mailto:${site.email}`, 0, "ghost")}
        </div>
        <ul class="proof-line" aria-label="核心经历" data-hero-item>${site.hero.proof.map(item => `<li>${esc(item)}</li>`).join("")}</ul>
      </div>
      <figure class="hero__visual reveal" aria-label="第八轨道品牌视觉" data-hero-visual>
        <img src="assets/neptune-orbital-core.webp" alt="深蓝色海王星轨道视觉" data-orbit-media>
        <figcaption><span>THE EIGHTH ORBIT</span><span>Product · User · Market</span></figcaption>
      </figure>
    </section>

    <section class="positioning-strip" aria-label="职业定位">
      ${site.positioning.map(item => `<span>${esc(item)}</span>`).join("")}
    </section>

    <section class="section section--work" id="work" aria-labelledby="work-title">
      <header class="section-heading reveal" data-section-heading>
        <p class="eyebrow">Selected Work / Selected Cases</p>
        <h2 id="work-title">商业判断，需要可以被验证的证据。</h2>
        <p>从真实新品上市、独立产品，到全球品牌策略与用户洞察方法。</p>
      </header>
      <div class="work-list">${featured.map(caseRow).join("")}</div>
      ${lightweight.map(caseRow).join("")}
    </section>

    <section class="section section--thinking" id="thinking" aria-labelledby="thinking-title">
      <header class="section-heading reveal" data-section-heading>
        <p class="eyebrow">How I Think About Product Marketing</p>
        <h2 id="thinking-title">从用户开始，在市场反馈中结束。</h2>
      </header>
      <ol class="thinking-chain">
        ${capabilityChain.map((item, index) => `<li class="reveal"><span class="step">${String(index + 1).padStart(2, "0")}</span><div><strong>${esc(item.en)}</strong><span>${esc(item.zh)}</span></div><p>${esc(item.detail)}</p></li>`).join("")}
      </ol>
    </section>

    <section class="section section--experience" id="experience" aria-labelledby="experience-title">
      <header class="section-heading reveal" data-section-heading>
        <p class="eyebrow">Experience</p>
        <h2 id="experience-title">真实商业项目，与跨文化体验视角。</h2>
      </header>
      <div class="experience-list">
        ${experience.map(item => `<article class="experience-item reveal"><p class="experience-item__period">${esc(item.period)}</p><div><h3>${esc(item.company)}</h3><p class="experience-item__role">${esc(item.role)}</p></div><p>${esc(item.summary)}</p></article>`).join("")}
      </div>
    </section>

    <section class="section section--about" id="about" aria-labelledby="about-title">
      <div class="about-grid">
        <header class="section-heading reveal" data-section-heading>
          <p class="eyebrow">About / The Eighth Orbit</p>
          <h2 id="about-title">${esc(site.hero.statement)}</h2>
        </header>
        <div class="about-copy reveal">
          ${site.about.map(p => `<p>${esc(p)}</p>`).join("")}
          <p class="about-signoff">${esc(site.englishName)} · ${esc(site.name)}</p>
        </div>
      </div>
    </section>

    <section class="section section--tools" aria-labelledby="tools-title">
      <header class="section-heading reveal" data-section-heading>
        <p class="eyebrow">AI & Tools</p>
        <h2 id="tools-title">工具跟着任务走。</h2>
        <p>AI 提高搜索、整理和表达效率；事实核验、优先级与最终判断由人负责。</p>
      </header>
      <div class="workflow-table" role="list">
        ${toolWorkflow.map((item, index) => `<div class="workflow-row reveal" role="listitem"><span>${String(index + 1).padStart(2, "0")}</span><strong>${esc(item.stage)}</strong><p>${esc(item.tools)}</p><p>${esc(item.use)}</p></div>`).join("")}
      </div>
    </section>

    <section class="contact section" id="contact" aria-labelledby="contact-title">
      <div class="contact__inner reveal" data-section-heading>
        <p class="eyebrow">Contact</p>
        <h2 id="contact-title">一起把好产品，讲成用户在意的价值。</h2>
        <p>Product Marketing · GTM · Consumer Insight · Strategy</p>
        <div class="hero__actions">
          ${action("Email Shawn", `mailto:${site.email}`, 0)}
          ${action("Portfolio PDF", "assets/documents/li-xiang-product-marketing-portfolio.pdf", 0, "secondary")}
          ${action("Open Resume", "resume/", 0, "ghost")}
          ${action("View GitHub", site.github, 0, "ghost")}
        </div>
      </div>
    </section>`;

  return shell({ title: site.title, description: site.description, body, depth: 0, path: "", pageClass: "home-page" });
}

function renderFramework(items) {
  return `<ol class="framework" aria-label="思考框架">${items.map((item, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><strong>${esc(item)}</strong></li>`).join("")}</ol>`;
}

function renderExamples(items) {
  return `<div class="example-table" role="table" aria-label="Selected examples">
    <div class="example-table__head" role="row"><span role="columnheader">Signal / Capability</span><span role="columnheader">User Need</span><span role="columnheader">Scenario</span><span role="columnheader">Value</span></div>
    ${items.map(item => `<div class="example-table__row" role="row"><strong role="cell">${esc(item.signal)}</strong><span role="cell">${esc(item.need)}</span><span role="cell">${esc(item.scene)}</span><span role="cell">${esc(item.value)}</span></div>`).join("")}
  </div>`;
}

function renderTriad(items) {
  return `<div class="triad">${items.map((item, index) => `<article><span>${String(index + 1).padStart(2, "0")}</span><h3>${esc(item.title)}</h3><ul>${item.items.map(entry => `<li>${esc(entry)}</li>`).join("")}</ul></article>`).join("")}</div>`;
}

function renderGallery(items, depth) {
  return `<div class="case-gallery ${items.length === 1 ? "case-gallery--single" : ""}">${items.map(item => `<figure data-image-reveal><img src="${href(item.src, depth)}" alt="${esc(item.alt)}" loading="lazy"></figure>`).join("")}</div>`;
}

function renderCaseSection(section, depth) {
  return `<section class="case-section reveal" id="${esc(section.id)}" data-case-section>
    <header class="case-section__heading">
      <p class="eyebrow">${esc(section.eyebrow)}</p>
      <h2>${esc(section.title)}</h2>
    </header>
    <div class="case-section__content">
      ${section.body ? section.body.map(p => `<p>${esc(p)}</p>`).join("") : ""}
      ${section.quote ? `<blockquote>${esc(section.quote)}</blockquote>` : ""}
      ${section.tags ? `<ul class="tag-list tag-list--large">${section.tags.map(tag => `<li>${esc(tag)}</li>`).join("")}</ul>` : ""}
      ${section.framework ? renderFramework(section.framework) : ""}
      ${section.examples ? renderExamples(section.examples) : ""}
      ${section.triad ? renderTriad(section.triad) : ""}
      ${section.list ? `<ul class="case-list">${section.list.map(item => `<li>${esc(item)}</li>`).join("")}</ul>` : ""}
      ${section.gallery ? renderGallery(section.gallery, depth) : ""}
    </div>
  </section>`;
}

function casePage(item) {
  const depth = 2;
  const localSource = item.hero.source && !external(item.hero.source) ? href(item.hero.source, depth) : item.hero.source;
  const nextIndex = (cases.indexOf(item) + 1) % cases.length;
  const next = cases[nextIndex];
  const body = `
    <article class="case">
      <header class="case-hero section-pad">
        <div class="case-hero__copy reveal" data-case-hero-copy>
          <a class="back-link" href="${rel(depth)}#work">${icon("arrow-left")}<span>Selected Work</span></a>
          <p class="eyebrow">${esc(item.order)} / ${esc(item.type)}</p>
          <h1>${esc(item.title)}</h1>
          <p class="case-hero__subtitle">${esc(item.subtitle)}</p>
          <p class="case-hero__summary">${esc(item.summary)}</p>
          <dl class="case-meta">
            <div><dt>Project</dt><dd>${esc(item.status)}</dd></div>
            <div><dt>Role</dt><dd>${esc(item.role)}</dd></div>
            <div><dt>Year</dt><dd>${esc(item.year)}</dd></div>
          </dl>
          ${item.cta ? action(item.cta.label, item.cta.url, depth) : ""}
        </div>
        <figure class="case-hero__media reveal" data-case-hero-media>
          <img src="${href(item.hero.src, depth)}" alt="${esc(item.hero.alt)}">
          <figcaption>${localSource ? `<a href="${esc(localSource)}"${external(localSource) ? ' target="_blank" rel="noreferrer"' : ""}>${esc(item.hero.caption)} ${icon("arrow-up-right")}</a>` : esc(item.hero.caption)}</figcaption>
        </figure>
      </header>

      <div class="case-layout">
        <aside class="case-toc" aria-label="Case 目录">
          <p>On this case</p>
          <nav>${item.sections.map(section => `<a href="#${esc(section.id)}">${esc(section.eyebrow.replace(/^\d+\s*\/\s*/, ""))}</a>`).join("")}</nav>
        </aside>
        <div class="case-content">${item.sections.map(section => renderCaseSection(section, depth)).join("")}</div>
      </div>

      <aside class="disclosure reveal" aria-label="Disclosure">
        <p class="eyebrow">Disclosure</p>
        <p>${esc(item.disclosure)}</p>
      </aside>

      <nav class="next-case reveal" aria-label="Next case" data-next-case>
        <a href="../${esc(next.slug)}/"><span>Next Case · ${esc(next.order)}</span><strong>${esc(next.title)}</strong>${icon("arrow-right")}</a>
      </nav>
    </article>`;

  return shell({
    title: `${item.title} — ${site.englishName}`,
    description: item.summary,
    body,
    depth,
    active: "work",
    path: `cases/${item.slug}/`,
    pageClass: "case-page"
  });
}

function resumePage() {
  const depth = 1;
  const primaryCases = cases.slice(0, 4);
  const body = `
    <article class="resume-view section-pad">
      <header class="resume-hero reveal">
        <div>
          <p class="eyebrow">Resume / Product Marketing</p>
          <h1>${esc(site.name)} <span>${esc(site.englishName)}</span></h1>
          <p>Product Marketing · GTM · User Insight · Marketing Strategy</p>
        </div>
        <div class="resume-actions">
          ${action("Download PDF Resume", "resume.pdf", depth)}
          ${action("Portfolio PDF", "assets/documents/li-xiang-product-marketing-portfolio.pdf", depth, "secondary")}
          ${action("Email", `mailto:${site.email}`, depth, "ghost")}
        </div>
      </header>

      <section class="resume-block reveal">
        <h2>Profile</h2>
        <div><p>围绕用户、产品与市场，把复杂产品能力转成清晰价值主张，并参与内容、上市执行、反馈复盘与策略迭代。拥有 vivo 旗舰新品产品营销实习、独立 AI 营销产品与全球品牌策略项目经验。</p></div>
      </section>

      <section class="resume-block reveal">
        <h2>Capability</h2>
        <div class="resume-capabilities">${site.positioning.map(item => `<span>${esc(item)}</span>`).join("")}</div>
      </section>

      <section class="resume-block reveal">
        <h2>Experience & Education</h2>
        <div class="resume-lines">${experience.map(item => `<article><p>${esc(item.period)}</p><div><h3>${esc(item.company)}</h3><strong>${esc(item.role)}</strong><span>${esc(item.summary)}</span></div></article>`).join("")}</div>
      </section>

      <section class="resume-block reveal">
        <h2>Selected Work</h2>
        <div class="resume-lines">${primaryCases.map(item => `<article><p>${esc(item.order)}</p><div><h3><a href="${rel(depth)}cases/${esc(item.slug)}/">${esc(item.title)}</a></h3><strong>${esc(item.type)}</strong><span>${esc(item.summary)}</span></div></article>`).join("")}</div>
      </section>

      <section class="resume-block resume-contact reveal">
        <h2>Contact</h2>
        <div><a href="mailto:${esc(site.email)}">${esc(site.email)}</a><a href="${esc(site.website)}">${esc(site.website.replace(/^https?:\/\//, ""))}</a><a href="${esc(site.github)}">${esc(site.github.replace(/^https?:\/\//, ""))}</a></div>
      </section>
    </article>`;
  return shell({ title: `Resume — ${site.englishName}`, description: `${site.englishName} 的 Product Marketing 求职摘要。`, body, depth, active: "resume", path: "resume/", pageClass: "resume-page" });
}

await output("index.html", homePage());
for (const item of cases) await output(`cases/${item.slug}/index.html`, casePage(item));
await output("resume/index.html", resumePage());
await output("resume.html", `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=resume/"><link rel="canonical" href="${site.website}resume/"><title>Resume — ${site.englishName}</title></head><body><p><a href="resume/">Open resume</a></p></body></html>`);
await output("404.html", shell({ title: `Page not found — ${site.englishName}`, description: "The requested page could not be found.", body: `<section class="not-found section-pad"><p class="eyebrow">404</p><h1>这条轨道还不存在。</h1>${action("Back Home", "./", 0)}</section>`, depth: 0 }));
await output("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${site.website}sitemap.xml\n`);
await output("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${["", "resume/", ...cases.map(item => `cases/${item.slug}/`)].map(path => `  <url><loc>${site.website}${path}</loc></url>`).join("\n")}\n</urlset>\n`);

console.log(`Built ${cases.length + 4} pages.`);
