import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is required. No draft was generated.");
const root = path.resolve(import.meta.dirname, "..");
const categories = JSON.parse(await readFile(path.join(root, "content/blog/categories.json"), "utf8"));
const postFiles = await (await import("node:fs/promises")).readdir(path.join(root, "content/blog/posts"));
const recentPosts = await Promise.all(postFiles.filter((file) => file.endsWith(".json")).map(async (file) => JSON.parse(await readFile(path.join(root, "content/blog/posts", file), "utf8"))));
recentPosts.sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
const recentCategories = new Set(recentPosts.slice(0, 2).map(({ category }) => category));
const candidates = categories.filter(({ name }) => !recentCategories.has(name));
const requestedCategory = process.env.BLOG_CATEGORY?.trim();
if (requestedCategory && !categories.some(({ name }) => name === requestedCategory)) throw new Error(`Unknown BLOG_CATEGORY: ${requestedCategory}`);
const selectedCategory = requestedCategory || candidates[Math.floor(Math.random() * candidates.length)]?.name || categories[Math.floor(Math.random() * categories.length)].name;
const today = new Date().toISOString().slice(0, 10);
const topic = process.env.BLOG_TOPIC?.trim() || `${selectedCategory}について横浜の地域住民が日常で実践できること`;
const schema = {
  type: "object", additionalProperties: false,
  required: ["slug", "title", "description", "imagePrompt", "imageAlt", "introduction", "sections", "sources"],
  properties: {
    slug: { type: "string", pattern: "^[a-z0-9-]+$" }, title: { type: "string" }, description: { type: "string" }, imagePrompt: { type: "string" }, imageAlt: { type: "string" }, introduction: { type: "string" },
    sections: { type: "object", additionalProperties: false, required: ["theme", "background", "dailyPoints", "actions", "cautions", "summary"], properties: Object.fromEntries(["theme", "background", "dailyPoints", "actions", "cautions", "summary"].map((key) => [key, { type: "string" }])) },
    sources: { type: "array", items: { type: "object", additionalProperties: false, required: ["title", "url"], properties: { title: { type: "string" }, url: { type: "string", pattern: "^https://" } } } }
  }
};
const instructions = `あなたは「いざ横浜」の健康ブログ編集補助です。テーマは「${topic}」、カテゴリーは「${selectedCategory}」です。一般の方に分かる日本語で、専門用語には説明を付け、不安を煽らず、診断や治療を断定しないでください。横浜での暮らしや地域活動との接点を自然に含めてください。厚生労働省、e-ヘルスネット、横浜市、WHO、医学系学会、査読済み論文など、実在を確実に把握している一次情報だけを sources に挙げてください。不確かな数値・論文・URLは書かず、必要なら sources を空にしてください。医療相談が必要になり得る内容には受診を促してください。imagePrompt は実写写真の選定・生成用で、日本の地域社会、自然光、清潔感、公共性を表し、イラスト、SVG、CG、医療広告、高級サロン、過度な広告風の演出を避けてください。imageAlt はその写真内容を簡潔に説明してください。画像そのものは生成しません。`;
const response = await fetch("https://api.openai.com/v1/responses", { method: "POST", headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-5-mini", input: instructions, text: { format: { type: "json_schema", name: "health_blog_draft", strict: true, schema } } }) });
if (!response.ok) throw new Error(`Draft API failed (${response.status}): ${await response.text()}`);
const payload = await response.json();
const output = payload.output_text || payload.output?.flatMap((item) => item.content || []).find((item) => item.type === "output_text")?.text;
if (!output) throw new Error("Draft API returned no text.");
const generated = JSON.parse(output);

const verifiedSources = [];
for (const source of generated.sources) {
  try {
    const url = new URL(source.url);
    if (!['www.mhlw.go.jp', 'kennet.mhlw.go.jp', 'www.city.yokohama.lg.jp', 'www.who.int'].some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`))) continue;
    const check = await fetch(url, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(10000) });
    if (check.ok) verifiedSources.push({ ...source, checkedAt: today });
  } catch { /* Unreachable or malformed sources are omitted from the draft. */ }
}
const slug = `${today.slice(0, 7)}-${generated.slug}`.slice(0, 80);
const imageFilename = `${slug}.png`.slice(0, 85);
const draft = { slug, status: "draft", title: generated.title, description: generated.description, publishedAt: null, updatedAt: today, category: selectedCategory, image: `/marugameseiko/assets/images/blog/${imageFilename}`, imageAlt: generated.imageAlt, imageStatus: "awaiting-file", imageFilename, imagePrompt: generated.imagePrompt, introduction: generated.introduction, sections: generated.sections, sources: verifiedSources, relatedActivities: [], relatedPosts: [] };
const destination = path.join(root, "content/blog/posts", `${draft.slug}.json`);
await mkdir(path.dirname(destination), { recursive: true });
await writeFile(destination, `${JSON.stringify(draft, null, 2)}\n`, { flag: "wx" });
console.log(destination);
