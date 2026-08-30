from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import inch, mm
from reportlab.lib.utils import ImageReader
from PIL import Image

REPO = Path(__file__).resolve().parents[1]
OUT = REPO / "dist/pdf"
OUT.mkdir(parents=True, exist_ok=True)

PORTFOLIO = OUT / "李翔-Product-Marketing-Portfolio.pdf"
RESUME = OUT / "李翔-Product-Marketing-Resume.pdf"

WEBSITE = "https://shawn-cyber666.github.io/shawn-portfolio/"
LIVE = "https://shrimp-company.vercel.app/"
EMAIL = "x_222324@163.com"
GITHUB = "https://github.com/Shawn-cyber666"

pdfmetrics.registerFont(TTFont("Heiti", "/System/Library/Fonts/STHeiti Medium.ttc"))
pdfmetrics.registerFont(TTFont("ArialUnicode", "/System/Library/Fonts/Supplemental/Arial Unicode.ttf"))

BG = HexColor("#030609")
SURFACE = HexColor("#0B0F14")
INK = HexColor("#F5F7F9")
BODY = HexColor("#B7C0C8")
MUTED = HexColor("#76818D")
QUIET = HexColor("#46515D")
LINE = HexColor("#20262D")
ACCENT = HexColor("#74D7FF")

PW, PH = 13.333 * inch, 7.5 * inch
M = 0.68 * inch


def wrapped(text, font, size, width):
    lines, current = [], ""
    for char in str(text):
        candidate = current + char
        if char == "\n":
            lines.append(current)
            current = ""
        elif pdfmetrics.stringWidth(candidate, font, size) <= width or not current:
            current = candidate
        else:
            lines.append(current.rstrip())
            current = char.lstrip()
    if current:
        lines.append(current)
    return lines


def paragraph(c, text, x, y, width, size=12, leading=None, color=BODY, font="ArialUnicode", max_lines=None):
    leading = leading or size * 1.55
    lines = wrapped(text, font, size, width)
    if max_lines:
        lines = lines[:max_lines]
    c.setFont(font, size)
    c.setFillColor(color)
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


def title(c, text, x, y, width, size=38, leading=None, color=INK, font="Heiti", max_lines=3):
    leading = leading or size * 1.06
    lines = wrapped(text, font, size, width)[:max_lines]
    c.setFont(font, size)
    c.setFillColor(color)
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


def label(c, text, x, y, color=ACCENT):
    c.setFont("Helvetica-Bold", 7.2)
    c.setFillColor(color)
    c.drawString(x, y, text.upper())


def line(c, x1, y, x2, color=LINE, width=0.6):
    c.setStrokeColor(color)
    c.setLineWidth(width)
    c.line(x1, y, x2, y)


def image_crop(c, path, x, y, w, h, radius=10):
    path = Path(path)
    if not path.exists():
        return
    with Image.open(path) as im:
        iw, ih = im.size
    scale = max(w / iw, h / ih)
    dw, dh = iw * scale, ih * scale
    dx, dy = x + (w - dw) / 2, y + (h - dh) / 2
    c.saveState()
    p = c.beginPath()
    p.roundRect(x, y, w, h, radius)
    c.clipPath(p, stroke=0, fill=0)
    c.drawImage(ImageReader(path), dx, dy, dw, dh, mask="auto")
    c.restoreState()


def image_fit(c, path, x, y, w, h):
    path = Path(path)
    if not path.exists():
        return
    c.drawImage(ImageReader(path), x, y, w, h, preserveAspectRatio=True, anchor="c", mask="auto")


def pill(c, text, x, y, color=BODY):
    size = 7.2
    pad_x, pad_y = 7, 4
    width = pdfmetrics.stringWidth(text, "Helvetica", size) + pad_x * 2
    c.setStrokeColor(LINE)
    c.setLineWidth(0.5)
    c.roundRect(x, y - pad_y, width, 16, 8, stroke=1, fill=0)
    c.setFont("Helvetica", size)
    c.setFillColor(color)
    c.drawString(x + pad_x, y + 1, text)
    return x + width + 6


def link_text(c, text, url, x, y, size=9, color=INK, font="ArialUnicode"):
    c.setFont(font, size)
    c.setFillColor(color)
    c.drawString(x, y, text)
    width = pdfmetrics.stringWidth(text, font, size)
    c.linkURL(url, (x, y - 3, x + width, y + size + 2), relative=0)
    return x + width


def base(c, page_no, section="THE EIGHTH ORBIT"):
    c.setFillColor(BG)
    c.rect(0, 0, PW, PH, stroke=0, fill=1)
    c.setFont("ArialUnicode", 7)
    c.setFillColor(INK)
    c.drawString(M, PH - 0.34 * inch, "08  第八轨道")
    c.setFont("Helvetica", 6.4)
    c.setFillColor(QUIET)
    c.drawRightString(PW - M, PH - 0.34 * inch, f"{section}  /  {page_no:02d}")
    line(c, M, 0.35 * inch, PW - M)
    c.setFont("Helvetica", 6.2)
    c.setFillColor(QUIET)
    c.drawString(M, 0.19 * inch, "SHAWN LI — PRODUCT MARKETING & STRATEGY")
    c.drawRightString(PW - M, 0.19 * inch, "shawn-cyber666.github.io/shawn-portfolio")
    c.linkURL(WEBSITE, (PW - 2.8 * inch, 0.12 * inch, PW - M, 0.31 * inch), relative=0)


def new_page(c, page_no, section):
    if page_no > 1:
        c.showPage()
    base(c, page_no, section)


def draw_portfolio():
    c = canvas.Canvas(str(PORTFOLIO), pagesize=(PW, PH), pageCompression=1)
    c.setTitle("李翔 - Product Marketing Portfolio")
    c.setAuthor("李翔 / Shawn Li")
    c.setSubject("Product Marketing, GTM, User Insight, Marketing Strategy")

    # 01 Cover
    base(c, 1, "PORTFOLIO")
    image_crop(c, REPO / "assets/neptune-orbital-core.webp", 7.15 * inch, 0.75 * inch, 5.45 * inch, 5.95 * inch, 0)
    label(c, "Shawn Li — Product Marketing & Strategy", M, 5.9 * inch)
    y = title(c, "把判断变成系统。", M, 5.25 * inch, 6.2 * inch, 44, 46)
    paragraph(c, "从用户与产品出发，把技术能力转成用户价值，再用 GTM、内容与 AI 工作流推动落地。", M, y - 10, 5.7 * inch, 13.2, 22)
    y2 = 1.55 * inch
    x = M
    for tag in ["Product Marketing", "GTM", "User Insight", "Marketing Strategy"]:
        x = pill(c, tag, x, y2)
    link_text(c, "Personal Website  ↗", WEBSITE, M, 0.83 * inch, 8.5, ACCENT)

    # 02 Profile
    new_page(c, 2, "PROFILE")
    label(c, "Profile / Capability Map", M, 6.25 * inch)
    title(c, "用户洞察到市场迭代，\n是一条完整工作链。", M, 5.73 * inch, 5.25 * inch, 31, 35)
    paragraph(c, "消费体验、服务、旅游与跨文化研究，让我从真实情境理解用户。\nProduct Marketing 则把这种用户视角，连接到产品价值、上市表达与市场反馈。", M, 4.35 * inch, 4.95 * inch, 11.2, 18)
    steps = [
        ("01", "UNDERSTAND THE USER", "用户与情境"),
        ("02", "UNDERSTAND THE PRODUCT", "产品能力与证据"),
        ("03", "DEFINE THE VALUE", "利益与价值主张"),
        ("04", "BUILD THE STORY", "内容与传播表达"),
        ("05", "DELIVER THE EXPERIENCE", "上市与触点交付"),
        ("06", "LEARN & ITERATE", "反馈与策略迭代"),
    ]
    sx, sy, sw = 6.55 * inch, 5.9 * inch, 5.95 * inch
    for no, en, zh in steps:
        line(c, sx, sy + 13, sx + sw)
        c.setFont("Helvetica-Bold", 7)
        c.setFillColor(ACCENT)
        c.drawString(sx, sy, no)
        c.setFont("Helvetica-Bold", 10)
        c.setFillColor(INK)
        c.drawString(sx + 0.48 * inch, sy, en)
        c.setFont("ArialUnicode", 9)
        c.setFillColor(MUTED)
        c.drawRightString(sx + sw, sy, zh)
        sy -= 0.73 * inch
    line(c, sx, sy + 13, sx + sw)

    # 03 vivo context
    new_page(c, 3, "CASE 01 / VIVO X FOLD6")
    label(c, "01 / Flagship Commercial Project", M, 6.24 * inch)
    title(c, "vivo X Fold6", M, 5.68 * inch, 4.7 * inch, 42, 43)
    c.setFont("Helvetica", 16)
    c.setFillColor(BODY)
    c.drawString(M, 4.94 * inch, "Turning Product Capabilities into User Value")
    paragraph(c, "Product Marketing Intern / 2026\n用户与竞品洞察 · 场景研究 · 产品卖点表达\nKeynote · Demo · Launch Feedback", M, 4.43 * inch, 5.05 * inch, 10.5, 18)
    image_crop(c, REPO / "assets/vivo-x-fold6-official-page.jpg", 6.55 * inch, 2.25 * inch, 5.75 * inch, 3.45 * inch, 12)
    c.setFont("Helvetica", 6.2)
    c.setFillColor(QUIET)
    c.drawString(6.55 * inch, 2.08 * inch, "OFFICIAL PUBLIC MATERIAL / VIVO OFFICIAL WEBSITE")
    label(c, "Challenge", M, 2.63 * inch)
    title(c, "技术能力不等于\n用户价值。", M, 2.22 * inch, 4.8 * inch, 28, 31)
    c.setFont("Helvetica", 13.2)
    c.setFillColor(ACCENT)
    c.drawString(6.55 * inch, 1.42 * inch, "How do we turn technical capabilities into user value?")

    # 04 vivo framework
    new_page(c, 4, "CASE 01 / FRAMEWORK")
    label(c, "Value Translation Framework", M, 6.25 * inch)
    title(c, "从能力证据，到传播表达。", M, 5.78 * inch, 7.5 * inch, 30, 34)
    framework = ["Product\nCapability", "User\nNeed", "Scenario", "User\nBenefit", "Value\nProposition", "Communication"]
    fw = (PW - M * 2) / len(framework)
    y = 4.72 * inch
    for i, item in enumerate(framework):
        x = M + i * fw
        c.setFont("Helvetica-Bold", 7)
        c.setFillColor(ACCENT)
        c.drawString(x, y + 0.56 * inch, f"{i+1:02d}")
        line(c, x, y + 0.42 * inch, x + fw - 14)
        parts = item.split("\n")
        c.setFont("Helvetica-Bold", 12)
        c.setFillColor(INK)
        for j, part in enumerate(parts):
            c.drawString(x, y - j * 15, part)
    label(c, "Selected Thinking", M, 3.32 * inch)
    rows = [
        ("AI Agent", "移动办公", "AI Productivity"),
        ("Vibe Coding", "移动开发 / 创作", "Mobile Productivity"),
        ("通信能力", "差旅 / 大型活动", "Reliable Connection"),
        ("综合旗舰体验", "工作 + 娱乐", "白天 AI 生产力，晚上演唱会神器"),
    ]
    ty = 2.94 * inch
    widths = [2.2, 3.15, 5.65]
    headers = ["CAPABILITY", "SCENARIO", "USER VALUE / COMMUNICATION"]
    x0 = M
    for h, w in zip(headers, widths):
        c.setFont("Helvetica-Bold", 6.3); c.setFillColor(QUIET); c.drawString(x0, ty, h); x0 += w * inch
    ty -= 0.26 * inch
    for a, b, d in rows:
        line(c, M, ty + 11, PW - M)
        c.setFont("ArialUnicode", 9); c.setFillColor(INK); c.drawString(M, ty - 4, a)
        c.setFillColor(BODY); c.drawString(M + 2.2 * inch, ty - 4, b)
        c.drawString(M + 5.35 * inch, ty - 4, d)
        ty -= 0.46 * inch
    line(c, M, ty + 11, PW - M)

    # 05 vivo execution and result
    new_page(c, 5, "CASE 01 / EXECUTION")
    label(c, "Launch Workflow", M, 6.25 * inch)
    title(c, "判断必须进入真实交付。", M, 5.78 * inch, 7.2 * inch, 30, 34)
    flow = ["Insight", "Strategy", "Content", "Keynote", "Demo", "Rehearsal", "Launch", "Feedback"]
    fw = (PW - M * 2) / len(flow)
    y = 4.62 * inch
    for i, item in enumerate(flow):
        x = M + i * fw
        c.setFillColor(SURFACE); c.roundRect(x, y, fw - 9, 42, 7, stroke=0, fill=1)
        c.setFont("Helvetica-Bold", 6.2); c.setFillColor(ACCENT); c.drawString(x + 9, y + 27, f"{i+1:02d}")
        c.setFont("Helvetica-Bold", 8.2); c.setFillColor(INK); c.drawString(x + 9, y + 11, item)
    paragraph(c, "协同 GTM、商务、产品、设计、导演组、KOL 与外部执行团队，推进讲稿、Keynote、演示素材、彩排和提词版本。", M, 4.04 * inch, 11.25 * inch, 10.5, 17)
    label(c, "Public Result", M, 3.18 * inch)
    results = [
        "部分本人提出的表达进入正式 Keynote 与讲稿",
        "支持产品故事、演示素材与旗舰新品正式发布交付",
        "参与上市后用户反馈、竞品口碑与传播表现复盘",
        "为后续内容优化与策略迭代提供结构化输入",
    ]
    ry = 2.82 * inch
    for i, item in enumerate(results):
        x = M + (i % 2) * 6.0 * inch
        yy = ry - (i // 2) * 0.76 * inch
        c.setFont("Helvetica-Bold", 7); c.setFillColor(ACCENT); c.drawString(x, yy, f"{i+1:02d}")
        paragraph(c, item, x + 0.42 * inch, yy + 1, 5.15 * inch, 10, 15)
    line(c, M, 1.07 * inch, PW - M)
    paragraph(c, "CONFIDENTIALITY  仅使用官方公开产品信息与本人重绘框架；不包含内部聊天、Keynote 源文件、销售数据、内部策略、用户数据、后台或供应商信息。", M, 0.83 * inch, 11.8 * inch, 7.3, 11, MUTED)

    # 06 insight
    new_page(c, 6, "CASE 02 / MARKET & CONSUMER INSIGHT")
    label(c, "Market & Consumer Insight", M, 6.25 * inch)
    title(c, "把碎片化信号，\n变成结构化判断。", M, 5.75 * inch, 5.3 * inch, 31, 34)
    image_crop(c, REPO / "assets/strategy-hub.png", M, 1.02 * inch, 5.5 * inch, 3.5 * inch, 12)
    stages = ["Market Signals", "Collection", "Evidence Check", "Classification", "Pain Point / Motivation", "Pattern", "Opportunity", "Strategy Input"]
    sx, sy = 6.75 * inch, 5.46 * inch
    for i, item in enumerate(stages):
        line(c, sx, sy + 11, PW - M)
        c.setFont("Helvetica-Bold", 7); c.setFillColor(ACCENT); c.drawString(sx, sy, f"{i+1:02d}")
        c.setFont("Helvetica-Bold", 10); c.setFillColor(INK); c.drawString(sx + 0.43 * inch, sy, item)
        sy -= 0.49 * inch
    line(c, sx, sy + 11, PW - M)
    paragraph(c, "公开信号可以指向问题，不能自动代表市场。记录来源与时间范围，说明渠道偏差，区分搜索结果与真实 UGC，不虚构样本量。", 6.75 * inch, 1.18 * inch, 5.6 * inch, 9.4, 14.5)

    # 07 wave architecture
    new_page(c, 7, "CASE 03 / WAVE BUREAU")
    label(c, "Independent Live Product / AI × Marketing", M, 6.25 * inch)
    title(c, "造浪局", M, 5.72 * inch, 4.4 * inch, 40, 42)
    c.setFont("Helvetica", 17); c.setFillColor(BODY); c.drawString(M, 5.02 * inch, "AI-powered Marketing Workflow")
    paragraph(c, "市场信息分散、整理重复、跨工具切换频繁。于是我把问题定义成一条工作流，而不是再增加一个聊天窗口。", M, 4.48 * inch, 4.75 * inch, 11, 18)
    columns = [
        ("INPUT", ["UGC", "Media Reviews", "Competitor Info", "User Feedback", "Market Signals"]),
        ("AI PROCESSING", ["Search", "Classification", "Summarization", "Pain-point Extraction", "Comparison"]),
        ("OUTPUT", ["Consumer Insight", "Market Trend", "Marketing Opportunity", "Content Input", "Strategy Input"]),
    ]
    cx, cy, cw = 5.85 * inch, 5.38 * inch, 2.12 * inch
    for idx, (head, items) in enumerate(columns):
        x = cx + idx * 2.28 * inch
        c.setFillColor(SURFACE); c.roundRect(x, 1.48 * inch, cw, 3.95 * inch, 11, stroke=0, fill=1)
        c.setFont("Helvetica-Bold", 7); c.setFillColor(ACCENT); c.drawString(x + 15, 4.98 * inch, f"0{idx+1} / {head}")
        iy = 4.45 * inch
        for item in items:
            line(c, x + 15, iy + 10, x + cw - 15)
            c.setFont("Helvetica", 8.3); c.setFillColor(BODY); c.drawString(x + 15, iy - 2, item)
            iy -= 0.48 * inch
    link_text(c, "View Live Product  ↗", LIVE, M, 1.04 * inch, 9, ACCENT)

    # 08 wave product
    new_page(c, 8, "CASE 03 / LIVE PRODUCT")
    label(c, "Real Product Evidence", M, 6.25 * inch)
    title(c, "不是概念稿，\n而是可以进入的产品。", M, 5.75 * inch, 5.4 * inch, 31, 34)
    image_crop(c, REPO / "assets/cases/wave-bureau/dashboard.jpg", M, 1.27 * inch, 5.85 * inch, 3.6 * inch, 11)
    image_crop(c, REPO / "assets/cases/wave-bureau/workflows.jpg", 6.8 * inch, 1.27 * inch, 5.85 * inch, 3.6 * inch, 11)
    c.setFont("ArialUnicode", 8.8); c.setFillColor(MUTED)
    c.drawString(M, 1.05 * inch, "Dashboard / Current product interface")
    c.drawString(6.8 * inch, 1.05 * inch, "Workflows / 13 workflows visible at audit")
    paragraph(c, "当前 IA：Dashboard · Workflows · Team · Tasks · Todos · AI School · Sentiment · Messages · Settings。AI 负责组织信息和中间产物；事实核验、优先级与最终判断仍由人完成。", 6.5 * inch, 5.68 * inch, 5.95 * inch, 10.2, 16)

    # 09 Ace
    new_page(c, 9, "CASE 04 / GLOBAL BRAND STRATEGY")
    label(c, "Recruitment Assessment / Independent Strategy Case", M, 6.25 * inch)
    title(c, "Insta360 Ace Pro\nProduct Line", M, 5.73 * inch, 5.1 * inch, 30, 33)
    paragraph(c, "从传播审计出发，将分散的产品证据收束为可记忆、可验证的品牌平台。", M, 4.58 * inch, 4.7 * inch, 10.8, 17)
    image_crop(c, REPO / "assets/cases/ace-pro/deck-cover.jpg", M, 1.0 * inch, 4.7 * inch, 2.75 * inch, 8)
    image_crop(c, REPO / "assets/cases/ace-pro/brand-platform.jpg", 5.65 * inch, 1.0 * inch, 3.25 * inch, 2.75 * inch, 8)
    sx = 9.3 * inch
    label(c, "Strategy Chain", sx, 5.54 * inch)
    chain = [
        "Product proof is strong",
        "Brand memory remains fragmented",
        "The hidden competitor is capture doubt",
        "Confidence for the unrepeatable",
        "ONE TAKE. ACED.",
        "90-day learning agenda",
    ]
    sy = 5.15 * inch
    for i, item in enumerate(chain):
        line(c, sx, sy + 10, PW - M)
        c.setFont("Helvetica-Bold", 6.5); c.setFillColor(ACCENT); c.drawString(sx, sy, f"{i+1:02d}")
        c.setFont("ArialUnicode", 8.3); c.setFillColor(INK); c.drawString(sx + 0.38 * inch, sy, item)
        sy -= 0.52 * inch
    line(c, sx, sy + 10, PW - M)
    link_text(c, "View Full Strategy Deck  ↗", WEBSITE + "assets/documents/li-xiang-ace-pro-brand-strategy.pdf", sx, 1.03 * inch, 8, ACCENT)
    paragraph(c, "说明：这是完成并提交的招聘笔试，不是 Insta360 任职或客户项目；不声称策略被采用或产生业务结果。", M, 0.75 * inch, 7.7 * inch, 7.3, 11, MUTED)

    # 10 execution + thinking
    new_page(c, 10, "EXECUTION & METHOD")
    label(c, "Marketing & Experience Projects", M, 6.25 * inch)
    title(c, "策略之外，也能把事情\n推进到现场。", M, 5.75 * inch, 5.5 * inch, 29, 32)
    projects = [
        ("MACAU UNIVERSITY", "摄影比赛暨展览", "方案 · 宣传物料 · 项目协同 · 现场执行"),
        ("DEEP-SEA TECH FORUM", "海南省深海科技论坛", "展区规划 · 动线 · B2B 沟通 · 多方交付"),
        ("SERVICE EXPERIENCE", "宾客体验与一线反馈", "需求识别 · 服务缺口 · 跨团队闭环"),
    ]
    py = 4.43 * inch
    for en, zh, desc in projects:
        line(c, M, py + 14, 5.9 * inch)
        c.setFont("Helvetica-Bold", 6.4); c.setFillColor(ACCENT); c.drawString(M, py, en)
        c.setFont("Heiti", 12); c.setFillColor(INK); c.drawString(M + 1.73 * inch, py - 1, zh)
        c.setFont("ArialUnicode", 8.2); c.setFillColor(MUTED); c.drawString(M + 1.73 * inch, py - 18, desc)
        py -= 0.82 * inch
    sx = 6.55 * inch
    label(c, "How I Think", sx, 6.25 * inch)
    steps = ["Understand the User", "Understand the Product", "Define the Value", "Build the Story", "Deliver the Experience", "Learn from the Market", "Iterate"]
    sy = 5.75 * inch
    for i, item in enumerate(steps):
        line(c, sx, sy + 10, PW - M)
        c.setFont("Helvetica-Bold", 6.5); c.setFillColor(ACCENT); c.drawString(sx, sy, f"{i+1:02d}")
        c.setFont("Helvetica-Bold", 9.2); c.setFillColor(INK); c.drawString(sx + 0.43 * inch, sy, item)
        sy -= 0.58 * inch
    line(c, sx, sy + 10, PW - M)
    label(c, "Method in Practice", sx, 1.44 * inch)
    evidence = [
        ("USER INSIGHT", "vivo 场景判断"),
        ("DEFINE VALUE", "产品能力 → 用户利益"),
        ("LAUNCH & LEARN", "Keynote · Launch · Feedback"),
    ]
    ey = 1.14 * inch
    for method, proof in evidence:
        c.setFont("Helvetica-Bold", 6.7); c.setFillColor(ACCENT); c.drawString(sx, ey, method)
        c.setFont("ArialUnicode", 8); c.setFillColor(BODY); c.drawString(sx + 1.43 * inch, ey, proof)
        ey -= 0.27 * inch

    # 11 contact
    new_page(c, 11, "AI, TOOLS & CONTACT")
    label(c, "AI-enabled Workflow", M, 6.25 * inch)
    title(c, "工具提高效率，\n判断决定下一步。", M, 5.74 * inch, 5.7 * inch, 31, 34)
    tools = [
        ("Research", "AI Search / Public Sources"),
        ("Analysis", "Excel / SPSS / AI"),
        ("Strategy", "Framework / Insight Synthesis"),
        ("Content", "PowerPoint / Keynote / AI"),
        ("Execution", "Project Collaboration"),
        ("Review", "Feedback Analysis"),
    ]
    ty = 4.5 * inch
    for i, (stage, tool) in enumerate(tools):
        x = M + (i % 2) * 3.05 * inch
        yy = ty - (i // 2) * 0.66 * inch
        c.setFont("Helvetica-Bold", 6.5); c.setFillColor(ACCENT); c.drawString(x, yy, f"{i+1:02d}")
        c.setFont("Helvetica-Bold", 9.5); c.setFillColor(INK); c.drawString(x + 0.38 * inch, yy, stage)
        c.setFont("Helvetica", 7.5); c.setFillColor(MUTED); c.drawString(x + 0.38 * inch, yy - 15, tool)
    label(c, "A Real Workflow Example", M, 2.25 * inch)
    c.setFont("Heiti", 18); c.setFillColor(INK); c.drawString(M, 1.86 * inch, "造浪局：从市场信号到策略输入")
    paragraph(c, "Market Signals → Classification → Synthesis → Consumer Insight → Strategy Input", M, 1.48 * inch, 6.0 * inch, 8.2, 12.5, BODY, "ArialUnicode")
    paragraph(c, "AI 加速搜索、分类与归纳；来源核验、优先级与最终判断由人负责。", M, 1.08 * inch, 5.95 * inch, 7.8, 12, MUTED)
    link_text(c, "View 造浪局  ↗", LIVE, M, 0.70 * inch, 8, ACCENT, "ArialUnicode")
    sx = 7.2 * inch
    label(c, "Contact", sx, 6.25 * inch)
    title(c, "一起把好产品，\n讲成用户在意的价值。", sx, 5.74 * inch, 5.3 * inch, 27, 31)
    y = 4.18 * inch
    link_text(c, EMAIL, f"mailto:{EMAIL}", sx, y, 11, INK, "ArialUnicode")
    y -= 0.48 * inch
    link_text(c, "Personal Website  ↗", WEBSITE, sx, y, 10, ACCENT)
    y -= 0.4 * inch
    link_text(c, "造浪局 Live Product  ↗", LIVE, sx, y, 10, ACCENT, "ArialUnicode")
    y -= 0.4 * inch
    link_text(c, "GitHub  ↗", GITHUB, sx, y, 10, ACCENT)
    paragraph(c, "Product Marketing · GTM · Consumer Insight · Marketing Strategy · AI-enabled Workflow", sx, 1.65 * inch, 5.2 * inch, 8.5, 13, MUTED)
    c.save()


def draw_resume():
    W, H = A4
    c = canvas.Canvas(str(RESUME), pagesize=A4, pageCompression=1)
    c.setTitle("李翔 - Product Marketing Resume")
    c.setAuthor("李翔 / Shawn Li")
    c.setFillColor(HexColor("#F7F7F5")); c.rect(0, 0, W, H, stroke=0, fill=1)
    margin = 16 * mm
    c.setFillColor(BG); c.rect(0, H - 51 * mm, W, 51 * mm, stroke=0, fill=1)
    c.setFont("Heiti", 28); c.setFillColor(INK); c.drawString(margin, H - 23 * mm, "李翔")
    c.setFont("Helvetica-Bold", 10); c.setFillColor(ACCENT); c.drawString(margin, H - 31 * mm, "PRODUCT MARKETING · GTM · USER INSIGHT · STRATEGY")
    c.setFont("ArialUnicode", 8.2); c.setFillColor(BODY)
    c.drawString(margin, H - 41 * mm, f"+86 13925899109  ·  {EMAIL}  ·  深圳 / 香港")
    email_x = margin + pdfmetrics.stringWidth("+86 13925899109  ·  ", "ArialUnicode", 8.2)
    email_w = pdfmetrics.stringWidth(EMAIL, "ArialUnicode", 8.2)
    c.linkURL(f"mailto:{EMAIL}", (email_x, H - 42 * mm, email_x + email_w, H - 38.5 * mm), relative=0)
    link_text(c, "Portfolio", WEBSITE, margin, H - 47 * mm, 7.5, ACCENT)
    link_text(c, "造浪局", LIVE, margin + 25 * mm, H - 47 * mm, 7.5, ACCENT, "ArialUnicode")
    link_text(c, "GitHub", GITHUB, margin + 47 * mm, H - 47 * mm, 7.5, ACCENT)

    def section_heading(text, y):
        c.setFont("Helvetica-Bold", 7.2); c.setFillColor(HexColor("#117AA3")); c.drawString(margin, y, text.upper())
        c.setStrokeColor(HexColor("#D5DADD")); c.setLineWidth(0.5); c.line(margin + 35 * mm, y + 2, W - margin, y + 2)
        return y - 5 * mm

    def body(text, x, y, width, size=8.1, leading=12):
        return paragraph(c, text, x, y, width, size, leading, HexColor("#303840"), "ArialUnicode")

    y = H - 58 * mm
    y = section_heading("Profile", y)
    y = body("围绕用户、产品与市场，把复杂产品能力转成清晰价值主张，并参与内容、上市执行、反馈复盘与策略迭代。拥有 vivo 旗舰新品产品营销、独立 AI 营销产品与全球品牌策略项目经验。", margin, y, W - 2 * margin, 8.4, 12.5) - 3 * mm

    y = section_heading("Experience", y)
    c.setFont("Heiti", 10); c.setFillColor(BG); c.drawString(margin, y, "vivo｜产品营销实习生｜X Fold6 / X300U")
    c.setFont("Helvetica", 7.3); c.setFillColor(MUTED); c.drawRightString(W - margin, y, "2026.03 - 2026.08")
    y -= 5 * mm
    bullets = [
        "持续追踪竞品发布、媒体评测、社媒 UGC 与用户反馈，拆解目标人群、需求场景与关注点，为卖点选择与上市策略提供输入。",
        "将续航、通信、AI Agent 等能力转译为用户收益与场景；提出 Vibe Coding / 游戏工作台及“白天 AI 生产力，晚上演唱会神器”等表达，部分进入正式 Keynote 与讲稿。",
        "协同 GTM、商务、产品、设计、导演组、KOL 与外部执行团队推进讲稿、演示素材、彩排与提词版本；参与上市后反馈复盘。",
    ]
    for text in bullets:
        c.setFillColor(HexColor("#117AA3")); c.circle(margin + 2, y + 3, 1.2, stroke=0, fill=1)
        y = body(text, margin + 5 * mm, y, W - 2 * margin - 5 * mm, 7.7, 10.8) - 1.5 * mm
    y -= 1 * mm

    y = section_heading("Projects", y)
    projects = [
        ("造浪局｜AI × Marketing Workflow（独立搭建）", "2026.06 - 至今", "整合公开 UGC、媒体评测与竞品信息，支持关键词检索、痛点归纳、竞品对比与结构化复盘；将输入、AI 处理和营销输出连接为可运行工作台。"),
        ("Insta360 Ace Pro Product Line｜独立品牌策略笔试", "2026.08", "从传播审计、消费洞察到品牌平台与 90-day learning agenda，完成 8 页英文策略交付；明确为招聘作业，不声称商业采用结果。"),
        ("市场与消费者洞察｜方法与工具", "2026", "将公开市场信号组织为 Collection - Evidence Check - Pattern - Opportunity - Strategy Input，并保留来源、偏差与人工判断边界。"),
    ]
    for name, date, desc in projects:
        c.setFont("Heiti", 9); c.setFillColor(BG); c.drawString(margin, y, name)
        c.setFont("ArialUnicode", 7); c.setFillColor(MUTED); c.drawRightString(W - margin, y, date)
        y = body(desc, margin, y - 4.3 * mm, W - 2 * margin, 7.4, 10.3) - 2.2 * mm

    y = section_heading("Additional Execution", y)
    y = body("宋创汇（广东横琴）文化体育有限公司｜策展企划（2025.08 - 2025.10） · 海南省南海会务有限公司｜会展助理（2024.07 - 2024.08） · 三亚山海天 JW 万豪酒店｜宾客关系员（2023.07 - 2023.08）", margin, y, W - 2 * margin, 7.35, 10.6) - 2.5 * mm

    y = section_heading("Education", y)
    education = [
        ("香港中文大学｜社会科学硕士 · 可持续旅游", "2026.09 - 2027.07（预计）"),
        ("澳门城市大学｜国际旅游与酒店管理学士 · 本科全英文授课", "2022.09 - 2026.06"),
        ("北京大学｜国际暑期学校 · 变化中的地球", "2025.06 - 2025.07"),
    ]
    for name, date in education:
        c.setFont("ArialUnicode", 7.8); c.setFillColor(HexColor("#303840")); c.drawString(margin, y, name)
        c.setFont("ArialUnicode", 7.1); c.setFillColor(MUTED); c.drawRightString(W - margin, y, date)
        y -= 4.6 * mm
    y -= 1 * mm

    y = section_heading("Skills", y)
    body("用户洞察 · 市场/竞品研究 · Value Proposition · GTM · 内容与活动 · 项目管理 · 跨部门协同\nExcel · SPSS · Streamlit · PowerPoint / Keynote · ChatGPT · Claude · Gemini · Codex｜中文（母语） · 英语（本科全英文授课）", margin, y, W - 2 * margin, 7.6, 11)
    c.setStrokeColor(HexColor("#D5DADD")); c.line(margin, 12 * mm, W - margin, 12 * mm)
    c.setFont("ArialUnicode", 6.5); c.setFillColor(MUTED); c.drawString(margin, 7.5 * mm, "李翔 / Shawn Li · Product Marketing Resume · 2026")
    c.drawRightString(W - margin, 7.5 * mm, "Turning judgment into systems.")
    c.save()


draw_portfolio()
draw_resume()
target_portfolio = REPO / "assets/documents/li-xiang-product-marketing-portfolio.pdf"
target_resume = REPO / "resume.pdf"
target_portfolio.write_bytes(PORTFOLIO.read_bytes())
target_resume.write_bytes(RESUME.read_bytes())
print(PORTFOLIO)
print(RESUME)
