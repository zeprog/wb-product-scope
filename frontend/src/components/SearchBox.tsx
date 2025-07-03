interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBox({ value, onChange }: Props) {
  return (
    <div style={{ marginBottom: 24 }}>
      <input
        type="text"
        value={value}
        placeholder="Поиск по названию..."
        onChange={e => onChange(e.target.value)}
        style={{ padding: 8, width: 300 }}
      />
    </div>
  );
}