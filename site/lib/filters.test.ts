import { describe, it, expect } from 'vitest';
import { filterCompanies, EMPTY_FILTERS } from './filters';
import type { Company } from './types';

const companies: Company[] = [
  {
    id: 'acme', company: 'Acme', role: 'Software Engineer Apprentice', location: 'London',
    length: '4 years', trainingProvider: '', grades: '', salary: '',
    openDate: '2026-09-01', closeDate: '2026-11-30', dateNotes: '', link: '', hasFactFile: false,
  },
  {
    id: 'beta-corp', company: 'Beta Corp', role: 'AI Engineer Apprentice', location: 'Manchester',
    length: '5 years', trainingProvider: '', grades: '', salary: '',
    openDate: '2026-01-01', closeDate: '2026-03-01', dateNotes: '', link: '', hasFactFile: false,
  },
];

describe('filterCompanies', () => {
  it('returns everything when criteria are empty', () => {
    expect(filterCompanies(companies, EMPTY_FILTERS)).toHaveLength(2);
  });

  it('matches query against company name, case-insensitive', () => {
    const result = filterCompanies(companies, { ...EMPTY_FILTERS, query: 'acme' });
    expect(result.map((c) => c.id)).toEqual(['acme']);
  });

  it('matches query against role', () => {
    const result = filterCompanies(companies, { ...EMPTY_FILTERS, query: 'AI Engineer' });
    expect(result.map((c) => c.id)).toEqual(['beta-corp']);
  });

  it('filters by location, case-insensitive', () => {
    const result = filterCompanies(companies, { ...EMPTY_FILTERS, location: 'london' });
    expect(result.map((c) => c.id)).toEqual(['acme']);
  });

  it('filters out companies opening before openAfter', () => {
    const result = filterCompanies(companies, { ...EMPTY_FILTERS, openAfter: '2026-06-01' });
    expect(result.map((c) => c.id)).toEqual(['acme']);
  });

  it('filters out companies closing after closeBefore', () => {
    const result = filterCompanies(companies, { ...EMPTY_FILTERS, closeBefore: '2026-06-01' });
    expect(result.map((c) => c.id)).toEqual(['beta-corp']);
  });
});
