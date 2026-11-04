# 个人网站

纯静态网站，不需要安装或编译，可以直接用 GitHub Pages 发布。

## 目录结构

```
index.html          首页（个人介绍 + 板块入口 + 最新文章）
assets/style.css    全站样式（含深浅色主题）
assets/site.js      全站配置：名字、介绍、板块列表都在 SITE 里改
assets/vendor/      Markdown 渲染库（marked、DOMPurify）
blog/index.html     博客列表（搜索 + 标签筛选）
blog/post.html      文章页
blog/posts.json     文章目录
blog/posts/*.md     文章正文（Markdown）
```

```
about.html          关于我
privacy.html        隐私政策（申请 Google AdSense 需要）
404.html            找不到页面时显示
sitemap.xml         网站地图（由 tools/build-sitemap.js 生成，推送到 main 时自动更新）
robots.txt          搜索引擎抓取规则（绑定自己的域名后才会生效）
```

## 常用操作

- **改名字、介绍、头像**：编辑 `assets/site.js` 顶部的 `SITE`。
- **写新文章**：在 `blog/posts/` 新建 `xxx.md`，再在 `blog/posts.json` 里登记一条（`slug` 与文件名一致）。
- **开放新板块**：在 `SITE.sections` 里把对应板块的 `ready` 改成 `true`，并把 `href` 指向新页面。

## 本地预览

文章是通过网络请求读取的，直接双击打开 HTML 会被浏览器拦截，需要用本地服务器：

```bash
python -m http.server 8000
```

然后访问 http://localhost:8000 。
