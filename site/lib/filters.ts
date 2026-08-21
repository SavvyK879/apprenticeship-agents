import type { Company } from './types';

export interface FilterCriteria {
  query: string;
  location: string;
  openAfter: string;
  closeBefore: string;
}

export const EMPTY_FILTERS: FilterCriteria = {
  query: '',
  location: '',
  openAfter: '',
  closeBefore: '',
};

export function filterCompanies(companies: Company[], criteria: FilterCriteria): Company[] {
  return companies.filter((c) => {
    if (criteria.query) {
      const q = criteria.query.toLowerCase();
      const matchesCompany = c.company.toLowerCase().includes(q);
      const matchesRole = c.role.toLowerCase().includes(q);
      if (!matchesCompany && !matchesRole) return false;
    }
    if (criteria.location && c.location.toLowerCase() !== criteria.location.toLowerCase()) {
      return false;
    }
    if (criteria.openAfter && c.openDate && c.openDate < criteria.openAfter) {
      return false;
    }
    if (criteria.closeBefore && c.closeDate && c.closeDate > criteria.closeBefore) {
      return false;
    }
    return true;
  });
}
