# 健康ブログ運用ガイド

## 保存と公開の仕組み

- カテゴリーは `content/blog/categories.json`、記事は `content/blog/posts/*.json` で管理します。
- `status: "draft"` はビルド対象外です。公開サイトの一覧にも記事HTMLにも出ません。
- 管理者は下書きの本文、断定表現、出典URLと記載内容、画像と代替テキスト、関連活動を確認します。健康・医療の内容は必要に応じて有識者にも確認を依頼してください。
- 承認後は `status` を `published` に変更し、`publishedAt` と `updatedAt` を `YYYY-MM-DD` で設定します。`npm run blog:build` を実行し、生成されたHTMLと一覧データも同じPRへ含めます。

## 新しい記事を追加する手順

1. `content/blog/posts/` に既存記事を参考にしたJSONを追加し、重複しない半角英数字の `slug` と `status: "draft"` を設定します。
2. テーマを決め、本文、概要、カテゴリー、参考情報を入力します。カテゴリーは `content/blog/categories.json` にある名称を使います。
3. 内容に合うアイキャッチ画像を `assets/images/blog/` に保存し、`image` と、画像の内容を説明する `imageAlt` を設定します。
4. 管理者が本文、出典、注意喚起、画像、SEO項目を確認します。必要に応じて医療・健康分野の有識者にも確認を依頼します。
5. 承認後にだけ `status` を `published` に変更し、公開日・更新日を設定して `npm run blog:build` を実行します。記事HTML、一覧データ、関連記事リンク、OGP、構造化データが生成されます。

この手順により、運用工程は **テーマ決定 → 下書き生成 → 内容確認 → アイキャッチ画像設定 → 承認 → 公開** となります。生成処理が `published` を設定することはありません。

## 記事と画像

記事JSONの `image` と `imageAlt` が、一覧、記事詳細、OG画像に使われます。画像は `assets/images/blog/` に置き、既存画像を使う場合は再追加せずパスだけを参照します。`imagePrompt` は将来の画像生成連携用の編集情報であり、現在は画像生成や外部送信を行いません。

## 自動下書き

`.github/workflows/health-blog-drafts.yml` は月・水・金に下書きを作り、管理者確認用Pull Requestを作成します。頻度は `schedule` のcronを編集して変更できます。手動実行ではカテゴリーとテーマを指定できます。生成結果は必ず `draft` で保存され、マージだけでは公開されません。

### 設定

リポジトリの **Settings → Secrets and variables → Actions** で、Repository secret `OPENAI_API_KEY` を登録する必要があります。キーをHTML、JavaScript、記事JSON、ログへ記載しないでください。任意のRepository variable `OPENAI_MODEL` でモデル名を変更できます。`GITHUB_TOKEN` はActionsが実行時に発行するため追加登録は不要です。

API未設定時はワークフローが明示的に失敗し、架空の記事や画像URLは作りません。到達確認できず、許可済みの公的機関ドメインでもない出典は下書きから除外されます。ただしURLに到達できることは内容の正しさを保証しないため、管理者による原文確認が必須です。

### 自動配信までに追加で必要な設定

- Repository secret `OPENAI_API_KEY` と、必要に応じてRepository variable `OPENAI_MODEL` を登録する。
- ActionsによるPull Request作成を許可し、レビュー担当者、CODEOWNERS、ブランチ保護ルールを設定する。
- 下書きテーマの決定方法（編集カレンダー、季節、カテゴリーの順番）と、公開頻度を確定してcronを調整する。
- アイキャッチ画像の作成・権利確認・代替テキスト記入を担当する工程を決める。現在のワークフローは画像を自動生成しない。
- 医療・健康情報の編集基準、出典の許可範囲、専門家確認が必要な条件、公開後の定期見直し日を決める。
- 承認済みPull Requestのマージ後に公開環境へ反映するデプロイ設定を確認する。公開操作は必ず人が承認した後に行う。
