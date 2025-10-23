export default function SearchBar({ value, onChange, onSearch, loading }: { value: string; onChange: (v: string)=>void; onSearch: ()=>void; loading?: boolean }) {
  return (
    <div className="flex gap-2">
      <input className="border border-neutral-800 bg-neutral-900 px-3 py-2 flex-1" value={value} onChange={e=>onChange(e.target.value)} placeholder="Sorte suchenÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¦" />
      <button onClick={onSearch} className="bg-emerald-600 text-white px-4 py-2 rounded min-w-28">{loading? 'SucheÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¦' : 'Suchen'}</button>
    </div>
  );
}