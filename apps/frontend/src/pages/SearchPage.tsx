import { useState } from "react";
import { track } from "@/lib/analytics";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  async function onSearch() {
    // ...deine bestehende Suchlogik hier...
    // Beispiel:
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data);

    // Analytics-Event
    await track("search_performed", { term_len: query.length, results: data.length });
  }

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Sorte suchen..."
        className="border p-2 rounded"
      />
      <button onClick={onSearch} className="ml-2 bg-green-500 text-white px-4 py-2 rounded">
        Suchen
      </button>
      <ul>
        {results.map((r) => (
          <li key={r._id}>{r.name}</li>
        ))}
      </ul>
    </div>
  );
}
