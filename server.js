// ART MORINA ENTERPRISES™ — official localhost server. Zero dependencies.
// Run:  node server.js        (or: PORT=3000 node server.js)
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 6767;
const ROOT = __dirname;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = path.normalize(path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath));
  if (!file.startsWith(ROOT + path.sep)) { res.writeHead(403); return res.end('nice try. art sees you.'); }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end('<h1 style="font-family:Comic Sans MS">404: Nuggets Not Found 🍗❓</h1><a href="/">back to the empire</a>');
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`
  ╔══════════════════════════════════════════════════╗
  ║   🍗  ART MORINA ENTERPRISES™ IS NOW SERVING  🍗  ║
  ╠══════════════════════════════════════════════════╣
  ║   Owner of KFC · Your Local Host · The Sign™      ║
  ║   Open → ${url.padEnd(40)}║
  ║   Ctrl+C to close the restaurant                  ║
  ╚══════════════════════════════════════════════════╝
`);
});
server.on('error', e => {
  if (e.code === 'EADDRINUSE') console.error(`Port ${PORT} is taken (probably by Art). Try: PORT=6768 node server.js`);
  else throw e;
});
