'use client';

import { useState } from 'react';
import type { Company } from '@/lib/types';
import { filterCompanies, EMPTY_FILTERS } from '@/lib/filters';
import { FilterBar } from './FilterBar';
import { CompanyCard } from './CompanyCard';

export function DirectoryBrowser({ companies }: { companies: Company[] }) {
  const [criteria, setCriteria] = useState(EMPTY_FILTERS);
  const filtered = filterCompanies(companies, criteria);

  return (
    <div>
      <FilterBar criteria={criteria} onChange={setCriteria} />
      <p>{filtered.length} of {companies.length} companies</p>
      {filtered.map((c) => (
        <CompanyCard key={c.id} company={c} />
      ))}
    </div>
  );
}
