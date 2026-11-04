/* ============================================================
 * 全站配置：改名字、介绍、板块，都在 SITE 里改
 * ============================================================ */
const SITE = {
  name: "你的名字",
  avatar: "",   // 头像图片地址，留空就显示名字的第一个字
  intro: "欢迎来到我的小站。这里记录我的想法、作品和生活。",

  // 网站板块。ready: false 表示“即将上线”，首页显示为灰色
  sections: [
    { id: "blog",     icon: "📝", title: "博客",     desc: "随笔、技术笔记和生活记录",  href: "blog/", ready: true },
    { id: "projects", icon: "🛠️", title: "作品",     desc: "做过的项目和小作品",        href: "#",     ready: false },
    { id: "photos",   icon: "📷", title: "相册",     desc: "拍下的风景和日常",          href: "#",     ready: false },
    { id: "reading",  icon: "📚", title: "书影音",   desc: "读过的书、看过的电影",      href: "#",     ready: false },
    { id: "about",    icon: "🌸", title: "关于我",   desc: "我是谁，以及怎么找到我",    href: "#",     ready: false }
  ]
};

/* ---------- 工具函数 ---------- */
const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// 页面所在目录相对网站根目录的路径前缀，例如 blog/ 下面是 "../"
const ROOT = document.documentElement.dataset.root || "";

/* ---------- 导航和页脚 ---------- */
function renderChrome(activeId) {
  const nav = document.getElementById("site-nav");
  if (nav) {
    const links = SITE.sections.filter(s => s.ready).map(s =>
      `<a href="${ROOT}${s.href}" class="${s.id === activeId ? "active" : ""}">${esc(s.title)}</a>`).join("");
    nav.innerHTML = `
      <div class="wrap">
        <a class="logo" href="${ROOT}index.html">${esc(SITE.name)}</a>
        <div class="nav-links">
          <a href="${ROOT}index.html" class="hide-sm ${activeId === "home" ? "active" : ""}">首页</a>
          ${links}
          <button class="theme-btn" id="themeBtn" aria-label="切换深浅色">◐</button>
        </div>
      </div>`;
  }
  const footer = document.getElementById("site-footer");
  if (footer) footer.textContent = `© ${new Date().getFullYear()} ${SITE.name} · Made with 🌸`;
  initTheme();
}

/* ---------- 深浅色切换 ---------- */
function initTheme() {
  const root = document.documentElement;
  try { const t = localStorage.getItem("theme"); if (t) root.dataset.theme = t; } catch (e) {}
  const btn = document.getElementById("themeBtn");
  if (!btn) return;
  btn.onclick = () => {
    const dark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  };
}

/* ---------- 樱花飘落背景 ---------- */
function startPetals() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cv = document.getElementById("petals");
  if (!cv) return;
  const ctx = cv.getContext("2d");
  let W, H;
  const resize = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
  addEventListener("resize", resize); resize();
  const make = y => ({
    x: Math.random() * W, y: y ?? Math.random() * H, r: 4 + Math.random() * 5,
    vy: 0.4 + Math.random() * 0.8, vx: -0.3 + Math.random() * 0.6,
    a: Math.random() * Math.PI * 2, va: 0.01 + Math.random() * 0.02
  });
  const petals = Array.from({ length: Math.min(24, Math.floor(W / 45)) }, () => make());
  (function tick() {
    ctx.clearRect(0, 0, W, H);
    for (const p of petals) {
      p.y += p.vy; p.x += p.vx + Math.sin(p.a) * 0.4; p.a += p.va;
      if (p.y > H + 10) Object.assign(p, make(-10));
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a);
      ctx.fillStyle = "rgba(255, 170, 196, 0.5)";
      ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * 0.6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(tick);
  })();
}

/* ---------- 读取博客文章列表 ---------- */
async function loadPosts() {
  const res = await fetch(`${ROOT}blog/posts.json`, { cache: "no-cache" });
  if (!res.ok) throw new Error("posts.json 读取失败");
  const posts = await res.json();
  return posts.filter(p => !p.draft).sort((a, b) => b.date.localeCompare(a.date));
}
