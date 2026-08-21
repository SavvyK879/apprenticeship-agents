import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  const raw = fs.readFileSync(filePath, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch {
    const err = new Error(`Malformed JSON in ${filePath}`);
    err.code = 'BAD_DATA_FILE';
    throw err;
  }
}

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

export function createServer({ companiesPath, personalPath }) {
  return http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/api/companies') {
      let companies;
      try {
        companies = readJson(companiesPath, []).map(({ id, company, role }) => ({ id, company, role }));
      } catch (err) {
        if (err.code === 'BAD_DATA_FILE') {
          sendJson(res, 500, { error: `${err.message}. Fix or remove the file, then reload.` });
          return;
        }
        sendJson(res, 500, { error: 'Unexpected server error' });
        return;
      }
      sendJson(res, 200, companies);
      return;
    }

    if (req.method === 'GET' && req.url === '/api/personal') {
      let personal;
      try {
        personal = readJson(personalPath, {});
      } catch (err) {
        if (err.code === 'BAD_DATA_FILE') {
          sendJson(res, 500, { error: `${err.message}. Fix or remove the file, then reload.` });
          return;
        }
        sendJson(res, 500, { error: 'Unexpected server error' });
        return;
      }
      sendJson(res, 200, personal);
      return;
    }

    if (req.method === 'POST' && req.url === '/api/personal') {
      let body = '';
      req.on('data', (chunk) => { body += chunk; });
      req.on('end', () => {
        let parsed;
        try {
          parsed = JSON.parse(body);
        } catch {
          sendJson(res, 400, { error: 'Request body is not valid JSON' });
          return;
        }

        const { id, entry } = parsed;
        if (typeof id !== 'string' || !id || typeof entry !== 'object' || entry === null) {
          sendJson(res, 400, { error: 'id and entry are required' });
          return;
        }

        try {
          const personal = readJson(personalPath, {});
          personal[id] = entry;
          fs.writeFileSync(personalPath, JSON.stringify(personal, null, 2));
          sendJson(res, 200, personal);
        } catch (err) {
          if (err.code === 'BAD_DATA_FILE') {
            sendJson(res, 500, { error: `${err.message}. Fix or remove the file, then reload.` });
            return;
          }
          sendJson(res, 500, { error: 'Unexpected server error' });
        }
      });
      return;
    }

    const requestedPath = req.url === '/' ? '/index.html' : req.url;
    const fullPath = path.join(PUBLIC_DIR, requestedPath);
    const rel = path.relative(PUBLIC_DIR, fullPath);
    if (rel.startsWith('..') || path.isAbsolute(rel) || !fs.existsSync(fullPath)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(fullPath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(fs.readFileSync(fullPath));
  });
}
