import fs from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import { loadCompanies } from '@/lib/companies';

export function generateStaticParams() {
  return loadCompanies().map((c) => ({ id: c.id }));
}

export default function FactFilePage({ params }: { params: { id: string } }) {
  const companies = loadCompanies();
  const company = companies.find((c) => c.id === params.id);
  if (!company) notFound();

  let factFileHtml: string | null = null;
  if (company.hasFactFile) {
    const factFilePath = path.join(
      process.cwd(),
      '..',
      'output',
      company.id,
      `${company.id}-fact-file.md`
    );
    factFileHtml = marked.parse(fs.readFileSync(factFilePath, 'utf-8')) as string;
  }

  return (
    <main style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
      <p><Link href="/">← Back to directory</Link></p>
      <h1>{company.company}</h1>
      <p>{company.role}</p>
      <p>{company.location} · {company.length}</p>
      <p>Opens: {company.openDate || 'unknown'} · Closes: {company.closeDate || 'unknown'}</p>
      {company.dateNotes && <p><em>{company.dateNotes}</em></p>}
      {company.link && (
        <p><a href={company.link} target="_blank" rel="noreferrer">Official listing</a></p>
      )}
      {factFileHtml ? (
        <div dangerouslySetInnerHTML={{ __html: factFileHtml }} />
      ) : (
        <p>No fact file has been written for this company yet.</p>
      )}
    </main>
  );
}
