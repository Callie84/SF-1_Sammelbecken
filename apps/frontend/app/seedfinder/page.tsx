'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import SearchBar from '@/components/SearchBar';
import PriceList from '@/components/PriceList';

type Seed = { _id?: string; name: string; currentPrices: { seedbank: string; price: number; currency: string }[] };

export default function SeedFinderPage() {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<Seed[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadToday() {
    setLoading(true); try { setItems(await api<Seed[]>('/api/prices/today')); } finally { setLoading(false); }
  }
  async function search() {
    if (!query) return loadToday();
    setLoading(true); try { setItems(await api<Seed[]>(`/api/prices/search?query=${encodeURIComponent(query)}`)); } finally { setLoading(false); }
  }

  useEffect(() => { loadToday(); }, []);

  return (
    <section>
      <h1 className="text-xl font-semibold mb-3">SeedFinder</h1>
      <SearchBar value={query} onChange={setQuery} onSearch={search} loading={loading} />
      <PriceList items={items} />
    </section>
  );
}