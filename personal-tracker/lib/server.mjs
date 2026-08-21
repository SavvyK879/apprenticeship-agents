import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function createServer({ companiesPath, personalPath }) {
  return http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/api/companies') {
      const companies = readJson(companiesPath, []).map(({ id, company, role }) => ({ id, company, role }));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(companies));
      return;
    }

    if (req.method === 'GET' && req.url === '/api/personal') {
      const personal = readJson(personalPath, {});
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(personal));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/personal') {
      let body = '';
      req.on('data', (chunk) => { body += chunk; });
      req.on('end', () => {
        const { id, entry } = JSON.parse(body);
        const personal = readJson(personalPath, {});
        personal[id] = entry;
        fs.writeFileSync(personalPath, JSON.stringify(personal, null, 2));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(personal));
      });
      return;
    }

    const requestedPath = req.url === '/' ? '/index.html' : req.url;
    const fullPath = path.join(PUBLIC_DIR, requestedPath);
    if (!fullPath.startsWith(PUBLIC_DIR) || !fs.existsSync(fullPath)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(fullPath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(fs.readFileSync(fullPath));
  });
}
