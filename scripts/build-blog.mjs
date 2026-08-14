import { access, readFile, readdir, writeFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const contentDir = path.join(root, "content/blog/posts");
const categories = JSON.parse(await readFile(path.join(root, "content/blog/categories.json"), "utf8"));
const categoryNames = new Set(categories.map(({ name }) => name));
const files = (await readdir(contentDir)).filter((file) => file.endsWith(".json"));
const posts = await Promise.all(files.map(async (file) => JSON.parse(await readFile(path.join(contentDir, file), "utf8"))));
const forbidden = ["必ず治る", "絶対に改善する", "これだけで病気を防げる", "薬は必要ない", "病院へ行く必要はない"];
for (const post of posts) {
  if (!/^[a-z0-9-]+$/.test(post.slug) || !["draft", "published"].includes(post.status)) throw new Error(`Invalid slug/status: ${post.slug}`);
  if (!categoryNames.has(post.category)) throw new Error(`Unknown category: ${post.category}`);
  if (!["awaiting-file", "ready"].includes(post.imageStatus)) throw new Error(`Invalid imageStatus: ${post.slug}`);
  if (!post.imageFilename || !/^[^/]+\.(?:jpe?g|png|webp|avif)$/i.test(post.imageFilename)) throw new Error(`Invalid imageFilename: ${post.slug}`);
  if (!post.image.startsWith("/marugameseiko/assets/") || path.posix.basename(post.image) !== post.imageFilename || !post.imageAlt) throw new Error(`A blog photo path and imageAlt are required: ${post.slug}`);
  if (forbidden.some((phrase) => JSON.stringify(post).includes(phrase))) throw new Error(`Forbidden claim in ${post.slug}`);
  if (post.status === "published") {
    if (!post.publishedAt || !post.updatedAt) throw new Error(`Published dates required: ${post.slug}`);
    for (const key of ["theme", "background", "dailyPoints", "actions", "cautions", "summary"]) if (!post.sections?.[key]) throw new Error(`Missing ${key}: ${post.slug}`);
    for (const source of post.sources || []) if (!source.title || !/^https:\/\//.test(source.url)) throw new Error(`Invalid source: ${post.slug}`);
  }
}

const published = posts.filter(({ status }) => status === "published").sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
const publicPosts = published.map(({ slug, category, publishedAt, title, description, image, imageAlt, imageStatus }) => ({
  category, date: publishedAt.replaceAll("-", "."), dateISO: publishedAt, title, summary: description, image, imageAlt, imageStatus,
  href: `/marugameseiko/blog/${slug}.html`
}));
await writeFile(path.join(root, "assets/js/blog-posts.js"), `// scripts/build-blog.mjs により生成。直接編集しないでください。\nwindow.BLOG_CATEGORIES = ${JSON.stringify(categories, null, 2)};\nwindow.BLOG_POSTS = ${JSON.stringify(publicPosts, null, 2)};\n`);

const esc = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const photoMarkup = (post) => `<div class="blog-photo-frame blog-hero-image"><img src="${esc(post.image)}" alt="${esc(post.imageAlt)}" width="1200" height="675" data-blog-photo>${post.imageStatus === "awaiting-file" ? `<span class="blog-image-unassigned" role="status"><strong>アイキャッチ写真 未設定</strong><span>${esc(post.imageFilename)} に実写写真を配置してください</span></span>` : ""}</div>`;
const base = "https://marumarukamekame.github.io/marugameseiko";
const header = (crumb) => `<a class="skip" href="#main">本文へ移動</a><header class="site-header"><a class="brand" href="/marugameseiko/" aria-label="いざ横浜 ホームへ"><img class="brand-logo" src="/marugameseiko/assets/images/いざ横浜.png" alt="いざ横浜"></a><button class="menu-button" aria-label="メニューを開く" aria-expanded="false"><span></span><span></span><span></span></button><nav class="global-nav" aria-label="メインナビゲーション"><a href="/marugameseiko/about.html">私たちについて</a><a href="/marugameseiko/projects.html">いざ地域活動</a><a href="/marugameseiko/clinic.html">治療院</a><a href="/marugameseiko/corporate.html">企業・団体の方へ</a><a href="/marugameseiko/voices.html">利用者・参加者の声</a><a href="/marugameseiko/blog/" aria-current="page">健康ブログ</a><a class="nav-contact" href="/marugameseiko/contact.html">お問い合わせ</a></nav></header>`;
const footer = `<footer class="site-footer"><div class="container"><div class="footer-grid"><div><a class="brand" href="/marugameseiko/"><img class="brand-logo" src="/marugameseiko/assets/images/いざ横浜.png" alt="いざ横浜"></a><p>横浜の健康を、地域とともにつくる。</p></div><div class="footer-links"><strong>活動について</strong><a href="/marugameseiko/about.html">私たちについて</a><a href="/marugameseiko/projects.html">いざ地域活動</a><a href="/marugameseiko/partnership.html">協賛・連携</a></div><div class="footer-links"><strong>ご案内</strong><a href="/marugameseiko/clinic.html">治療院</a><a href="/marugameseiko/corporate.html">企業・団体の方へ</a><a href="/marugameseiko/blog/">健康ブログ</a></div><div class="footer-links"><strong>運営情報</strong><a href="/marugameseiko/company.html">会社概要</a><a href="/marugameseiko/contact.html">お問い合わせ</a><a href="/marugameseiko/legal.html#disclaimer">免責事項</a></div></div><div class="footer-note">※ 本サイトは行政機関・公的機関の公式サイトではありません。　© いざ横浜</div></div></footer><script src="/marugameseiko/assets/js/data.js"></script><script src="/marugameseiko/assets/js/main.js"></script>`;
const linkCards = (items, empty) => items?.length ? `<div class="related-grid">${items.map((item) => `<a class="related-card" href="${esc(item.href)}"><strong>${esc(item.title)}</strong>${item.description ? `<span>${esc(item.description)}</span>` : ""}</a>`).join("")}</div>` : `<p class="muted">${empty}</p>`;

for (const post of published) {
  const canonical = `${base}/blog/${post.slug}.html`;
  let photoExists = true;
  try { await access(path.join(root, post.image.replace("/marugameseiko/", ""))); } catch { photoExists = false; }
  const schema = { "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.description, ...(photoExists ? { image: `${base}${post.image.replace("/marugameseiko", "")}` } : {}), datePublished: post.publishedAt, dateModified: post.updatedAt, mainEntityOfPage: canonical, publisher: { "@type": "Organization", name: "いざ横浜", url: `${base}/` } };
  const sources = post.sources?.length ? `<ul class="source-list">${post.sources.map((source) => `<li><a href="${esc(source.url)}" rel="noopener noreferrer">${esc(source.title)}</a><span>（最終確認：${esc(source.checkedAt || post.updatedAt)}）</span></li>`).join("")}</ul>` : `<p class="muted">この記事はブログの運営方針のお知らせであり、個別の健康上の主張は含みません。</p>`;
  const related = (post.relatedPosts || []).map((slug) => published.find((item) => item.slug === slug)).filter(Boolean).map((item) => ({ title: item.title, href: `/marugameseiko/blog/${item.slug}.html` }));
  const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(post.title)} | いざ横浜</title><meta name="description" content="${esc(post.description)}"><link rel="canonical" href="${canonical}"><meta property="og:title" content="${esc(post.title)} | いざ横浜"><meta property="og:description" content="${esc(post.description)}"><meta property="og:type" content="article"><meta property="og:url" content="${canonical}">${photoExists ? `<meta property="og:image" content="${base}${post.image.replace("/marugameseiko", "")}"><meta property="og:image:alt" content="${esc(post.imageAlt)}">` : ""}<link rel="stylesheet" href="/marugameseiko/assets/css/style.css"><script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script></head><body>${header(post.title)}<main id="main"><article class="blog-article"><div class="container blog-article-head"><nav class="breadcrumbs" aria-label="パンくず"><a href="/marugameseiko/">ホーム</a> / <a href="/marugameseiko/blog/">健康ブログ</a> / ${esc(post.title)}</nav>${photoMarkup(post)}<p class="blog-category">${esc(post.category)}</p><h1>${esc(post.title)}</h1><p class="article-dates">公開日 <time datetime="${post.publishedAt}">${post.publishedAt.replaceAll("-", ".")}</time><span>更新日 <time datetime="${post.updatedAt}">${post.updatedAt.replaceAll("-", ".")}</time></span></p></div><div class="prose article-body"><p class="article-intro">${esc(post.introduction)}</p><h2>健康上のテーマ・課題</h2><p>${esc(post.sections.theme)}</p><h2>なぜ起こるのか／背景</h2><p>${esc(post.sections.background)}</p><h2>日常生活で意識できるポイント</h2><p>${esc(post.sections.dailyPoints)}</p><h2>今日からできる具体的な行動</h2><p>${esc(post.sections.actions)}</p><aside class="article-caution"><h2>注意点</h2><p>${esc(post.sections.cautions)}</p></aside><h2>まとめ</h2><p>${esc(post.sections.summary)}</p><section><h2>参考情報・出典</h2>${sources}</section><section><h2>関連する「いざ地域活動」</h2>${linkCards(post.relatedActivities, "関連する活動は準備中です。")}</section><section><h2>関連記事</h2>${linkCards(related, "関連記事は順次追加します。")}</section></div></article></main>${footer}</body></html>`;
  await writeFile(path.join(root, `blog/${post.slug}.html`), html);
}

const expected = new Set(published.map(({ slug }) => `${slug}.html`));
for (const file of await readdir(path.join(root, "blog"))) if (/^\d{4}-.*\.html$/.test(file) && !expected.has(file)) await rm(path.join(root, "blog", file));
console.log(`Validated ${posts.length} posts; generated ${published.length} published article(s).`);
