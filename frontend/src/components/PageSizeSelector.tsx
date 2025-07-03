interface Props {
  value: number;
  onChange: (value: number) => void;
}

export default function PageSizeSelector({ value, onChange }: Props) {
  return (
    <div style={{ marginBottom: 24 }}>
      <label>Элементов на странице:&nbsp;</label>
      <select value={value} onChange={e => onChange(+e.target.value)}>
        {[10, 20, 50, 100].map(n => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
    </div>
  );
}