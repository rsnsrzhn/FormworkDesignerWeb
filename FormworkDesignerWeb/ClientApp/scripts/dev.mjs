import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const project = fileURLToPath(new URL("../../..", import.meta.url));
const root = path.join(project, "FormworkDesignerWeb/ClientApp/dist");
const media =
  process.env.MEDIA_DIRECTORY ||
  path.join(project, "opalubka-roliki-2026-11-02");
const api = new URL(process.env.API_URL || "http://localhost:5080");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".jpg": "image/jpeg",
  ".mp4": "video/mp4",
  ".txt": "text/plain",
  ".xml": "application/xml",
};
http
  .createServer(async (req, res) => {
    const pathname = new URL(req.url, "http://localhost").pathname;
    if (
      pathname.startsWith("/media/") &&
      !/^\/media\/(01-primery|02-razbivka|03-vysota|04-list|05-risovanie)\.(jpg|mp4)$/.test(
        pathname
      )
    ) {
      res.writeHead(404);
      res.end();
      return;
    }
    if (pathname.startsWith("/api/")) {
      const proxy = http.request(
        api.origin + req.url,
        { method: req.method, headers: { ...req.headers, host: api.host } },
        (upstream) => {
          res.writeHead(upstream.statusCode, upstream.headers);
          upstream.pipe(res);
        }
      );
      proxy.on("error", () => {
        res.writeHead(503, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Сервис временно недоступен. Попробуйте позже.",
          })
        );
      });
      req.pipe(proxy);
      return;
    }
    try {
      const base = pathname.startsWith("/media/") ? media : root;
      const relative = pathname.startsWith("/media/")
        ? pathname.slice(7)
        : pathname.slice(1);
      let file = path.resolve(base, decodeURIComponent(relative));
      if (
        !file.startsWith(path.resolve(base) + path.sep) &&
        file !== path.resolve(base)
      ) {
        res.writeHead(403);
        res.end();
        return;
      }
      try {
        if (!(await stat(file)).isFile()) throw new Error();
      } catch {
        if (path.extname(pathname)) {
          res.writeHead(404);
          res.end();
          return;
        }
        file = path.join(root, "index.html");
      }
      res.writeHead(200, {
        "Content-Type": mime[path.extname(file)] || "application/octet-stream",
      });
      res.end(await readFile(file));
    } catch {
      res.writeHead(404);
      res.end();
    }
  })
  .listen(Number(process.env.PORT || 5173), "127.0.0.1", () =>
    console.log("Preview: http://localhost:5173")
  );
