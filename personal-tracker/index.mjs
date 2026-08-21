import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from './lib/server.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 4321;

const server = createServer({
  companiesPath: path.join(__dirname, '..', 'data', 'companies.json'),
  personalPath: path.join(__dirname, '..', 'data', 'my-tracker.local.json'),
});

server.listen(PORT, () => {
  console.log(`Personal tracker running at http://localhost:${PORT}`);
});
