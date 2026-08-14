const data = window.SITE_DATA || { activities: [], posts: [] };

document.querySelectorAll("[data-blog-categories]").forEach((root) => {
  const categories = window.BLOG_CATEGORIES || [];
  root.innerHTML = ['<button data-filter="all" aria-pressed="true">すべて</button>', ...categories.map(({ name }) => `<button data-filter="${name}" aria-pressed="false">${name}</button>`)].join("");
});

document.querySelectorAll("[data-activities]").forEach((root) => {
  const isFeatureList = root.classList.contains("activity-feature-list");
  root.innerHTML = data.activities.map((item) => isFeatureList ? `
    <article class="activity-feature">
      <div class="activity-feature-image"><img src="${item.image}" alt="${item.imageAlt}" loading="lazy" width="1600" height="1067"></div>
      <div class="activity-feature-copy">
        <p class="activity-number">${item.number}</p>
        <h3>${item.title}</h3>${item.subtitle ? `<p class="activity-subtitle">${item.subtitle}</p>` : ""}<p>${item.summary}</p>
        <a class="text-link" href="${item.href}" aria-label="${item.title}を詳しく見る">詳しく見る <span aria-hidden="true">→</span></a>
      </div>
    </article>` : `
    <article class="activity-item">
      <p class="activity-number">${item.number}</p>
      <h3>${item.title}</h3>${item.subtitle ? `<p class="activity-subtitle">${item.subtitle}</p>` : ""}<p>${item.summary}</p>
      <a class="text-link" href="${item.href}">詳しく見る <span aria-hidden="true">→</span></a>
    </article>`).join("");
});

document.querySelectorAll("[data-posts]").forEach((root) => {
  const posts = window.BLOG_POSTS || data.posts;
  root.innerHTML = posts.map((post) => `
    <article class="post-item" data-category="${post.category}">
      <a class="post-image-link blog-photo-frame" href="${post.href}" aria-label="${post.title}を読む"><img class="post-image" src="${post.image}" alt="${post.imageAlt}" loading="lazy" width="1200" height="675" data-blog-photo><span class="blog-image-unassigned" role="status"><strong>アイキャッチ写真 未設定</strong><span>${post.image.split("/").pop()} に実写写真を配置してください</span></span></a>
      <div><p class="meta"><span>${post.category}</span><time${post.dateISO ? ` datetime="${post.dateISO}"` : ""}>${post.date}</time></p><h3><a href="${post.href}">${post.title}</a></h3><p>${post.summary}</p><a class="read-more" href="${post.href}" aria-label="${post.title}の続きを読む">続きを読む <span aria-hidden="true">→</span></a></div>
    </article>`).join("");
  if (!posts.length) root.innerHTML = '<p class="empty-posts">現在公開中の記事はありません。</p>';
});

const initializeBlogPhotos = (root = document) => root.querySelectorAll("[data-blog-photo]").forEach((image) => {
  const frame = image.closest(".blog-photo-frame");
  const update = () => frame?.classList.toggle("is-missing", !image.complete || image.naturalWidth === 0);
  image.addEventListener("load", update, { once: true });
  image.addEventListener("error", update, { once: true });
  if (image.complete) update();
});
initializeBlogPhotos();

const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".global-nav");
menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  nav.classList.toggle("is-open", !open);
});

document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () => {
  document.querySelectorAll("[data-filter]").forEach((item) => item.setAttribute("aria-pressed", "false"));
  button.setAttribute("aria-pressed", "true");
  document.querySelectorAll(".post-item").forEach((post) => {
    post.hidden = button.dataset.filter !== "all" && post.dataset.category !== button.dataset.filter;
  });
}));
