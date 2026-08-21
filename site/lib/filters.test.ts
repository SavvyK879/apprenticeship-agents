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
  {
    id: 'multi-city', company: 'Multi City Ltd', role: 'DevOps Apprentice', location: 'London / Birmingham',
    length: '3 years', trainingProvider: '', grades: '', salary: '',
    openDate: '2026-06-15', closeDate: '2026-08-15', dateNotes: '', link: '', hasFactFile: false,
  },
  {
    id: 'no-dates', company: 'No Dates Inc', role: 'Data Engineer Apprentice', location: 'Bristol',
    length: '2 years', trainingProvider: '', grades: '', salary: '',
    openDate: '', closeDate: '', dateNotes: '', link: '', hasFactFile: false,
  },
  {
    id: 'boundary-open', company: 'Boundary Corp', role: 'Backend Engineer Apprentice', location: 'Leeds',
    length: '4 years', trainingProvider: '', grades: '', salary: '',
    openDate: '2026-06-01', closeDate: '2026-09-30', dateNotes: '', link: '', hasFactFile: false,
  },
  {
    id: 'boundary-close', company: 'Close Ltd', role: 'Frontend Engineer Apprentice', location: 'Edinburgh',
    length: '3 years', trainingProvider: '', grades: '', salary: '',
    openDate: '2026-05-01', closeDate: '2026-06-01', dateNotes: '', link: '', hasFactFile: false,
  },
];

describe('filterCompanies', () => {
  it('returns everything when criteria are empty', () => {
    expect(filterCompanies(companies, EMPTY_FILTERS)).toHaveLength(6);
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
    const result = filterCompanies(companies, { ...EMPTY_FILTERS, location: 'manchester' });
    expect(result.map((c) => c.id)).toEqual(['beta-corp']);
  });

  it('filters out companies opening before openAfter', () => {
    const result = filterCompanies(companies, { ...EMPTY_FILTERS, openAfter: '2026-06-01' });
    expect(result.map((c) => c.id)).toEqual(['acme', 'multi-city', 'no-dates', 'boundary-open']);
  });

  it('filters out companies closing after closeBefore', () => {
    const result = filterCompanies(companies, { ...EMPTY_FILTERS, closeBefore: '2026-06-01' });
    expect(result.map((c) => c.id)).toEqual(['beta-corp', 'no-dates', 'boundary-close']);
  });

  it('matches location using substring match for multi-city strings', () => {
    const result = filterCompanies(companies, { ...EMPTY_FILTERS, location: 'london' });
    expect(result.map((c) => c.id)).toEqual(['acme', 'multi-city']);
  });

  it('includes companies with empty dates regardless of openAfter filter', () => {
    const result = filterCompanies(companies, { ...EMPTY_FILTERS, openAfter: '2026-06-01' });
    expect(result.map((c) => c.id)).toContain('no-dates');
  });

  it('includes companies with empty dates regardless of closeBefore filter', () => {
    const result = filterCompanies(companies, { ...EMPTY_FILTERS, closeBefore: '2026-06-01' });
    expect(result.map((c) => c.id)).toContain('no-dates');
  });

  it('keeps company with openDate exactly equal to openAfter', () => {
    const result = filterCompanies(companies, { ...EMPTY_FILTERS, openAfter: '2026-06-01' });
    expect(result.map((c) => c.id)).toContain('boundary-open');
  });

  it('keeps company with closeDate exactly equal to closeBefore', () => {
    const result = filterCompanies(companies, { ...EMPTY_FILTERS, closeBefore: '2026-06-01' });
    expect(result.map((c) => c.id)).toContain('boundary-close');
  });
});
