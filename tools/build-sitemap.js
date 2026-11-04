// 根据 blog/posts.json 生成 sitemap.xml
// 用法：在仓库根目录运行  node tools/build-sitemap.js
// 推送到 main 时 GitHub Actions 也会自动运行它（见 .github/workflows/sitemap.yml）
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const siteJs = fs.readFileSync(path.join(root, "assets/site.js"), "utf8");
const url = (siteJs.match(/url:\s*"([^"]+)"/) || [])[1];
if (!url) throw new Error("没有在 assets/site.js 里找到 url 配置");

const posts = JSON.parse(fs.readFileSync(path.join(root, "blog/posts.json"), "utf8"))
  .filter(p => !p.draft)
  .sort((a, b) => b.date.localeCompare(a.date));
const latest = posts[0]?.date;

const xmlEsc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const entry = (loc, lastmod) =>
  `  <url>\n    <loc>${xmlEsc(url + loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}\n  </url>`;

const urls = [
  entry("", latest),
  entry("blog/", latest),
  entry("about.html"),
  entry("privacy.html"),
  ...posts.map(p => entry(`blog/post.html?p=${encodeURIComponent(p.slug)}`, p.date))
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(root, "sitemap.xml"), xml);
console.log(`sitemap.xml 已生成，共 ${urls.length} 个网址`);
