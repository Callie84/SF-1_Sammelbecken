import { useTheme } from './useTheme';

export function ThemeSwitcher({ className = '' }:{ className?: string }){
  const { theme, setTheme, themes } = useTheme();
  return (
    <label className={`inline-flex items-center gap-2 ${className}`}>
      <span className="text-sm theme-muted">Theme</span>
      <select
        className="px-2 py-1 rounded border"
        value={theme}
        onChange={(e)=>setTheme(e.target.value)}
      >
        {themes.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
      </select>
    </label>
  );
}