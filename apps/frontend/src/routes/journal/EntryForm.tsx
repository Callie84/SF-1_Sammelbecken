import { useState } from 'react';
import { apiForm } from '../../lib/api';

export default function EntryForm({ onCreated }:{ onCreated: ()=>void }){
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
  const [tags, setTags] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent){
    e.preventDefault();
    setBusy(true); setErr(null);
    try{
      const fd = new FormData();
      fd.set('title', title);
      fd.set('notes', notes);
      fd.set('date', date);
      fd.set('tags', tags);
      if(files){ Array.from(files).forEach(f => fd.append('photos', f)); }
      await apiForm('/api/journal', fd);
      setTitle(''); setNotes(''); setTags(''); setFiles(null);
      onCreated();
    }catch(e:any){ setErr(e.message || 'Fehler'); }
    finally{ setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="p-4 border rounded theme-surface space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm">Titel</span>
          <input className="w-full border rounded px-2 py-1" value={title} onChange={e=>setTitle(e.target.value)} required />
        </label>
        <label className="block">
          <span className="text-sm">Datum</span>
          <input type="date" className="w-full border rounded px-2 py-1" value={date} onChange={e=>setDate(e.target.value)} required />
        </label>
      </div>
      <label className="block">
        <span className="text-sm">Tags (Kommagetrennt)</span>
        <input className="w-full border rounded px-2 py-1" value={tags} onChange={e=>setTags(e.target.value)} placeholder="blÃƒÆ’Ã‚Â¼te, bana, vpd" />
      </label>
      <label className="block">
        <span className="text-sm">Notizen</span>
        <textarea className="w-full border rounded px-2 py-1" value={notes} onChange={e=>setNotes(e.target.value)} rows={4} />
      </label>
      <label className="block">
        <span className="text-sm">Fotos (JPEG/PNG/WEBP, max. 10 MB je Datei)</span>
        <input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={e=>setFiles(e.target.files)} />
      </label>
      {err && <div className="text-red-600 text-sm">{err}</div>}
      <button disabled={busy} className="px-3 py-1 rounded bg-black/80 text-white disabled:opacity-50">{busy? 'SpeichereÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦':'Eintrag speichern'}</button>
    </form>
  );
}