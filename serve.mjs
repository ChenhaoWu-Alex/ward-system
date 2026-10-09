/* 管床系统 · 本地演示服务（零依赖）
 * 用法：node serve.mjs  （或双击 启动演示.bat）
 * 然后电脑浏览器开 http://localhost:8787 ；手机与电脑同一 Wi-Fi 时
 * 开 http://<电脑IP>:8787 可临时试用（正式使用请装 PWA，见使用说明）。 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (path === '/' || path === '') path = '/index.html';
    const file = normalize(join(ROOT, path));
    if (!file.startsWith(ROOT)) throw new Error('forbidden');
    const body = await readFile(file);
    res.writeHead(200, {
      'Content-Type': MIME[extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
      'Service-Worker-Allowed': '/',
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
  }
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('端口被占用。请关掉别的演示服务，或改 serve.mjs 里的 PORT。');
  } else {
    console.error(err);
  }
  process.exit(1);
}).listen(Number(process.env.PORT) || 8787, () => {
  console.log('管床系统演示服务已启动:  http://localhost:' + (Number(process.env.PORT) || 8787));
  console.log('手机试用: 与电脑同一 Wi-Fi，浏览器开 http://<电脑IP>:' + (Number(process.env.PORT) || 8787));
});
