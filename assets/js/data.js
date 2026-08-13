window.SITE_DATA = {
  activities: Array.from({ length: 10 }, (_, i) => ({
    number: String(i + 1).padStart(2, "0"),
    title: `活動${i + 1}`,
    summary: "活動内容は現在準備中です。目的・対象・実施内容が決まり次第、ここでお知らせします。",
    href: `/marugameseiko/activities/activity-${i + 1}.html`
  })),
  posts: [
    { category: "地域の健康", date: "2026.08.01", title: "健康ブログを開設しました", summary: "横浜の健康と、地域で続く活動についてお伝えしていきます。", href: "/marugameseiko/blog/sample.html" },
    { category: "お知らせ", date: "2026.07.20", title: "ウェブサイト準備のお知らせ", summary: "活動を分かりやすくお届けするため、ウェブサイトを準備しています。", href: "/marugameseiko/blog/sample.html" },
    { category: "活動報告", date: "2026.07.10", title: "活動報告は順次掲載します", summary: "写真と記録を通して、活動の様子を誠実に公開していきます。", href: "/marugameseiko/blog/sample.html" }
  ]
};

