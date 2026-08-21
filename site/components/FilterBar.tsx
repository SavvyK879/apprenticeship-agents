'use client';

import type { FilterCriteria } from '@/lib/filters';

export function FilterBar({
  criteria,
  onChange,
}: {
  criteria: FilterCriteria;
  onChange: (next: FilterCriteria) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
      <input
        type="text"
        placeholder="Search company or role"
        value={criteria.query}
        onChange={(e) => onChange({ ...criteria, query: e.target.value })}
      />
      <input
        type="text"
        placeholder="Location"
        value={criteria.location}
        onChange={(e) => onChange({ ...criteria, location: e.target.value })}
      />
      <label>
        Opens after
        <input
          type="date"
          value={criteria.openAfter}
          onChange={(e) => onChange({ ...criteria, openAfter: e.target.value })}
        />
      </label>
      <label>
        Closes before
        <input
          type="date"
          value={criteria.closeBefore}
          onChange={(e) => onChange({ ...criteria, closeBefore: e.target.value })}
        />
      </label>
    </div>
  );
}
