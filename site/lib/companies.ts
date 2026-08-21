import fs from 'node:fs';
import path from 'node:path';
import type { Company } from './types';

const DEFAULT_DATA_PATH = path.join(process.cwd(), '..', 'data', 'companies.json');
const DEFAULT_OUTPUT_DIR = path.join(process.cwd(), '..', 'output');

type RawCompany = Omit<Company, 'hasFactFile'>;

export function loadCompanies(
  dataPath: string = DEFAULT_DATA_PATH,
  outputDir: string = DEFAULT_OUTPUT_DIR
): Company[] {
  const raw: RawCompany[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  return raw.map((c) => ({
    ...c,
    hasFactFile: fs.existsSync(path.join(outputDir, c.id, `${c.id}-fact-file.md`)),
  }));
}
