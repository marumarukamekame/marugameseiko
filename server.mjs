import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const args = process.argv.slice(2);

function option(name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
}

const host = option("--host", process.env.HOST || "0.0.0.0");
const port = Number(option("--port", process.env.PORT || "4173"));
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8"
};

async function resolveFile(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, "http://localhost").pathname);
  const relativePath = normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, "").replace(/^[/\\]+/, "");
  let filePath = join(root, relativePath);

  try {
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) filePath = join(filePath, "index.html");
    await stat(filePath);
    return { filePath, status: 200 };
  } catch {
    return { filePath: join(root, "404.html"), status: 404 };
  }
}

const server = createServer(async (request, response) => {
  const { filePath, status } = await resolveFile(request.url || "/");
  response.writeHead(status, {
    "Content-Type": contentTypes[extname(filePath)] || "application/octet-stream",
    "Cache-Control": "no-cache"
  });
  createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`\nいざ横浜をプレビューしています。`);
  console.log(`  Local:   http://localhost:${port}/`);
  console.log(`  Network: http://${host}:${port}/`);
  console.log("\n終了するには Ctrl+C を押してください。\n");
});

