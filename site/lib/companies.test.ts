import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCompanies } from './companies';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_DATA = path.join(HERE, '__fixtures__', 'companies.json');
const FIXTURE_OUTPUT = path.join(HERE, '__fixtures__', 'output');

describe('loadCompanies', () => {
  it('loads every company from the data file', () => {
    const companies = loadCompanies(FIXTURE_DATA, FIXTURE_OUTPUT);
    expect(companies).toHaveLength(2);
  });

  it('marks hasFactFile true only when the fact file exists on disk', () => {
    const companies = loadCompanies(FIXTURE_DATA, FIXTURE_OUTPUT);
    const acme = companies.find((c) => c.id === 'acme');
    const beta = companies.find((c) => c.id === 'beta-corp');
    expect(acme?.hasFactFile).toBe(true);
    expect(beta?.hasFactFile).toBe(false);
  });
});
