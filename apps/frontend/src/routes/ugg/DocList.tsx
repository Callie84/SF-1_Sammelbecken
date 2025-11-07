type Doc = { slug: string; title: string; html: string; pdf: string };

export default function DocList({ docs, onSelect, activeSlug }:{ docs: Doc[]; onSelect: (d:Doc)=>void; activeSlug: string }) {
  return (
    <ul className="space-y-2">
      {docs.map(d => (
        <li key={d.slug}>
          <button className={`w-full text-left px-3 py-2 rounded ${activeSlug===d.slug? 'bg-gray-200':'bg-gray-100 hover:bg-gray-200'}`} onClick={()=>onSelect(d)}>
            {d.title}
          </button>
        </li>
      ))}
    </ul>
  );
}