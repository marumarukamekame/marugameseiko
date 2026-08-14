# 健康ブログ運用ガイド

## 保存と公開の仕組み

- カテゴリーは `content/blog/categories.json`、記事は `content/blog/posts/*.json` で管理します。
- `status: "draft"` はビルド対象外です。公開サイトの一覧にも記事HTMLにも出ません。
- 管理者は下書きの本文、断定表現、出典URLと記載内容、画像と代替テキスト、関連活動を確認します。健康・医療の内容は必要に応じて有識者にも確認を依頼してください。
- 承認後は `status` を `published` に変更し、`publishedAt` と `updatedAt` を `YYYY-MM-DD` で設定します。`npm run blog:build` を実行し、生成されたHTMLと一覧データも同じPRへ含めます。

## 記事と画像

記事JSONの `image` と `imageAlt` が、一覧、記事詳細、OG画像に使われます。画像は `assets/images/blog/` に置き、既存画像を使う場合は再追加せずパスだけを参照します。`imagePrompt` は将来の画像生成連携用の編集情報であり、現在は画像生成や外部送信を行いません。

## 自動下書き

`.github/workflows/health-blog-drafts.yml` は月・水・金に下書きを作り、管理者確認用Pull Requestを作成します。頻度は `schedule` のcronを編集して変更できます。手動実行ではカテゴリーとテーマを指定できます。生成結果は必ず `draft` で保存され、マージだけでは公開されません。

### 設定

リポジトリの **Settings → Secrets and variables → Actions** で、Repository secret `OPENAI_API_KEY` を登録する必要があります。キーをHTML、JavaScript、記事JSON、ログへ記載しないでください。任意のRepository variable `OPENAI_MODEL` でモデル名を変更できます。`GITHUB_TOKEN` はActionsが実行時に発行するため追加登録は不要です。

API未設定時はワークフローが明示的に失敗し、架空の記事や画像URLは作りません。到達確認できず、許可済みの公的機関ドメインでもない出典は下書きから除外されます。ただしURLに到達できることは内容の正しさを保証しないため、管理者による原文確認が必須です。
