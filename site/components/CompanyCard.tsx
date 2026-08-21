import Link from 'next/link';
import type { Company } from '@/lib/types';

export function CompanyCard({ company }: { company: Company }) {
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 6, padding: '1rem', marginBottom: '1rem' }}>
      <h2>{company.company} — {company.role}</h2>
      <p>{company.location} · {company.length}</p>
      <p>Opens: {company.openDate || 'unknown'} · Closes: {company.closeDate || 'unknown'}</p>
      {company.dateNotes && <p><em>{company.dateNotes}</em></p>}
      <p>
        <a href={company.link} target="_blank" rel="noreferrer">Listing</a>
        {company.hasFactFile && (
          <>
            {' · '}
            <Link href={`/company/${company.id}`}>Fact file</Link>
          </>
        )}
      </p>
    </div>
  );
}
