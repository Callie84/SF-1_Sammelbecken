import { useEffect, useState } from 'react';
import EntryForm from './EntryForm';
import EntryList, { Entry } from './EntryList';
import { apiJson } from '../../lib/api';

export default function JournalPage(){
  const [items, setItems] = useState<Entry[]>([]);
  const [total, setTotal] = useState(0);

  async function load(){
    const data = await apiJson<{ total:number; items: Entry[] }>(`/api/journal?limit=50&skip=0`);
    setItems(data.items);
    setTotal(data.total);
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">GrowÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬ËœDiary</h1>
        <div className="text-sm theme-muted">{total} EintrÃƒÆ’Ã‚Â¤ge</div>
      </header>
      <EntryForm onCreated={load} />
      <EntryList items={items} />
    </div>
  );
}