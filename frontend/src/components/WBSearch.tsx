import { useState } from "react";

interface Props {
  onParse: (query: string) => Promise<void>;
  disabled?: boolean;
}

export const WBSearch = ({ onParse, disabled }: Props) => {
  const [query, setQuery] = useState('');

  const handleClick = () => {
    if (!query.trim()) return;
    onParse(query.trim()).catch(console.error);
    setQuery('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleClick()
    }
  }

  return (
    <div style={{ marginBottom: 24, display: 'flex', gap: 8, alignItems: 'center' }}>
      <input
        type="text"
        placeholder="Поиск на WB..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKey}
        style={{ padding: 8, flex: 1 }}
        disabled={disabled}
      />
      <button onClick={handleClick} disabled={disabled || !query.trim()}>
        {disabled ? 'Парсим...' : 'Парсить WB'}
      </button>
    </div>
  )
}