import { useEffect, useState } from 'react';
import DocList from './DocList';
import DocViewer from './DocViewer';

type Doc = { slug: string; title: string; html: string; pdf: string };

export default function UGGPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [active, setActive] = useState<Doc | null>(null);

  useEffect(() => {
    fetch('/api/ugg/index.json').then(r => r.json()).then((d: Doc[]) => {
      setDocs(d);
      if (d.length) setActive(d[0]);
    });
  }, []);

  return (
    <div className="p-4 grid md:grid-cols-12 gap-4">
      <aside className="md:col-span-4 lg:col-span-3">
        <h1 className="text-2xl font-bold mb-3">UGGÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Ëœ1</h1>
        <DocList docs={docs} onSelect={setActive} activeSlug={active?.slug || ''} />
      </aside>
      <main className="md:col-span-8 lg:col-span-9">
        {active && <DocViewer doc={active} />}
      </main>
    </div>
  );
}