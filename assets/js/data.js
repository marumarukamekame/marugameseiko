window.SITE_DATA = {
  activities: [
    "定期的な地域総合スクリーニング",
    "専門的な健康教育講座",
    "在宅医療と遠隔診療",
    "健康グリーンベルトの構築",
    "デジタル健康教育百科",
    "救急技術研修",
    "高齢者向け施設の改修",
    "企業の健康管理戦略",
    "医薬品の回収と相談",
    "メンタルヘルス支援グループ"
  ].map((title, i) => ({
    number: String(i + 1).padStart(2, "0"),
    title,
    summary: "活動内容は現在準備中です。目的・対象・実施内容が決まり次第、ここでお知らせします。",
    href: `/marugameseiko/activities/activity-${i + 1}.html`
  })),
  posts: [
    { category: "地域の健康", date: "2026.08.01", title: "健康ブログを開設しました", summary: "横浜の健康と、地域で続く活動についてお伝えしていきます。", href: "/marugameseiko/blog/sample.html" },
    { category: "お知らせ", date: "2026.07.20", title: "ウェブサイト準備のお知らせ", summary: "活動を分かりやすくお届けするため、ウェブサイトを準備しています。", href: "/marugameseiko/blog/sample.html" },
    { category: "活動報告", date: "2026.07.10", title: "活動報告は順次掲載します", summary: "写真と記録を通して、活動の様子を誠実に公開していきます。", href: "/marugameseiko/blog/sample.html" }
  ]
};
