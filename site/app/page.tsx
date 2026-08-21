import { loadCompanies } from '@/lib/companies';
import { DirectoryBrowser } from '@/components/DirectoryBrowser';

export default function Home() {
  const companies = loadCompanies();
  return (
    <main style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Apprenticeship Directory</h1>
      <DirectoryBrowser companies={companies} />
    </main>
  );
}
