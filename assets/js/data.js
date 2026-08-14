window.SITE_DATA = {
  // 写真を差し替える場合は、各活動の image と imageAlt を更新してください。
  // 画像はサイト内の既存ファイルを使用し、公開時の画像切れを防いでいます。
  activities: [
    { title: "いざ検診", subtitle: "定期的な地域総合スクリーニング", summary: "身近な場所で健康を見つめ直すきっかけをつくり、地域の皆さまと健やかな暮らしを考える活動です。", image: "/marugameseiko/assets/digital-health-scale.png", imageAlt: "明るい空間で62.4キログラムを表示する白いデジタル体重計" },
    { title: "いざ講座", summary: "健康について知り、話し合える学びの場を通じて、日々の暮らしに生かせる気づきを届けます。", image: "/marugameseiko/assets/yokohama-city.png", imageAlt: "緑と建物が広がる横浜の街並み" },
    { title: "いざ健康診療", summary: "地域で安心して健康と向き合えるつながりを大切にし、暮らしに寄り添う支援を目指します。", image: "/marugameseiko/assets/images/ヨコハマ・ローズガーデン.png", imageAlt: "地域の憩いの場となる横浜の庭園" },
    { title: "いざ健康グリーンベルト", summary: "街の緑と人のつながりに目を向け、心身ともに健やかに過ごせる地域の環境を考えます。", image: "/marugameseiko/assets/yokohama-city.png", imageAlt: "緑に囲まれた横浜の地域風景" },
    { title: "いざ健康ライン", summary: "必要な情報へつながりやすい環境を整え、地域の中で健康を学び続けられる機会を育てます。", image: "/marugameseiko/assets/images/ヨコハマ・ローズガーデン.png", imageAlt: "人が集う横浜のローズガーデン" },
    { title: "いざ救急", summary: "もしもの時に地域で支え合えるよう、救急について知り、備えるための学びを広げます。", image: "/marugameseiko/assets/yokohama-city.png", imageAlt: "暮らしを支える横浜の街並み" },
    { title: "いざ高齢者", summary: "年齢を重ねても地域で自分らしく暮らせるよう、人と場所のやさしいつながりを考えます。", image: "/marugameseiko/assets/images/ヨコハマ・ローズガーデン.png", imageAlt: "誰もが散策できる横浜の庭園" },
    { title: "いざ健康管理", summary: "働く人と組織がともに健康を考え、無理なく継続できる取り組みづくりを支えます。", image: "/marugameseiko/assets/yokohama-city.png", imageAlt: "企業や人々が集まる横浜の街" },
    { title: "いざお薬", summary: "お薬との適切な付き合い方を地域で考え、安心して相談へつながれるきっかけをつくります。", image: "/marugameseiko/assets/images/ヨコハマ・ローズガーデン.png", imageAlt: "地域の暮らしに寄り添う横浜の風景" },
    { title: "いざメンタルケア", summary: "心の健康について安心して話せる関係を大切にし、孤立せず支え合える地域を目指します。", image: "/marugameseiko/assets/yokohama-city.png", imageAlt: "空と緑が開けた穏やかな横浜の風景" }
  ].map((activity, i) => ({
    ...activity,
    number: String(i + 1).padStart(2, "0"),
    href: `/marugameseiko/activities/activity-${i + 1}.html`
  })),
  posts: [
    { category: "地域の健康", date: "2026.08.01", title: "健康ブログを開設しました", summary: "横浜の健康と、地域で続く活動についてお伝えしていきます。", href: "/marugameseiko/blog/sample.html" },
    { category: "お知らせ", date: "2026.07.20", title: "ウェブサイト準備のお知らせ", summary: "活動を分かりやすくお届けするため、ウェブサイトを準備しています。", href: "/marugameseiko/blog/sample.html" },
    { category: "活動報告", date: "2026.07.10", title: "活動報告は順次掲載します", summary: "写真と記録を通して、活動の様子を誠実に公開していきます。", href: "/marugameseiko/blog/sample.html" }
  ]
};
