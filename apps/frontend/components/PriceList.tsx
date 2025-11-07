type Item = { _id?: string; name: string; currentPrices: { seedbank: string; price: number; currency: string }[] };

export default function PriceList({ items }: { items: Item[] }) {
  if (!items?.length) return <p className="opacity-70 mt-6">Keine Ergebnisse.</p>;
  return (
    <ul className="mt-6 grid md:grid-cols-2 gap-3">
      {items.map((s,i)=> (
        <li key={i} className="border border-neutral-800 p-3 rounded">
          <div className="font-semibold mb-1">{s.name}</div>
          <div className="text-sm opacity-80 mb-2">
            {s.currentPrices.map((p,j)=> (<span key={j} className="mr-3">{p.seedbank}: {p.price.toFixed(2)} {p.currency}</span>))}
          </div>
          {s._id && <a className="text-emerald-400 text-sm" href={`/seed/${s._id}`}>Details</a>}
        </li>
      ))}
    </ul>
  );
}