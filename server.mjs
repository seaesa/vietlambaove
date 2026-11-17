// Máy chủ chạy thử: phục vụ file tĩnh, mọi đường dẫn khác trả về index.html
// để bộ định tuyến JS xử lý URL sạch (không .html). Chạy: node server.mjs
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = new URL('.', import.meta.url).pathname;
const port = Number(process.env.PORT) || 8080;
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8'
};

createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  // URL cũ có .html → chuyển hướng vĩnh viễn sang URL sạch
  if (path.endsWith('.html') && path !== '/404.html') {
    const clean = path.replace(/(index)?\.html$/, '').replace(/\/$/, '') || '/';
    res.writeHead(301, { Location: clean });
    return res.end();
  }
  const file = normalize(join(root, path));
  if (file.startsWith(root) && !path.startsWith('/_ban-cu')) {
    try {
      if ((await stat(file)).isFile()) {
        res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
        return res.end(await readFile(file));
      }
    } catch {}
  }
  res.writeHead(200, { 'Content-Type': types['.html'] });
  res.end(await readFile(join(root, 'index.html')));
}).listen(port, () => console.log(`Việc Làm Bảo Vệ: http://localhost:${port}`));
