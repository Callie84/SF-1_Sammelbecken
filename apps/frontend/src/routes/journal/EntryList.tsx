import Photo from './Photo';

export type Entry = {
  _id: string;
  title: string;
  notes?: string;
  date: string;
  tags: string[];
  photos: { fileId: string; filename: string; contentType: string; size: number }[];
};

export default function EntryList({ items }:{ items: Entry[] }){
  if(!items.length) return <div className="theme-muted">Keine EintrÃƒÆ’Ã‚Â¤ge</div>;
  return (
    <div className="grid gap-4">
      {items.map(e => (
        <article key={e._id} className="p-4 border rounded theme-surface">
          <header className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">{e.title}</h2>
            <time className="text-sm theme-muted">{new Date(e.date).toLocaleDateString()}</time>
          </header>
          {e.tags?.length ? (
            <div className="text-xs theme-muted mt-1">Tags: {e.tags.join(', ')}</div>
          ) : null}
          {e.notes ? <p className="mt-2 whitespace-pre-wrap">{e.notes}</p> : null}
          {e.photos?.length ? (
            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
              {e.photos.map(p => <Photo key={String(p.fileId)} fileId={String(p.fileId)} alt={p.filename} />)}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}