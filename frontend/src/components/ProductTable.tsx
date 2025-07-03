import type { Product } from '../types';

interface Props {
  products: Product[];
  sortKey: keyof Product;
  sortOrder: 'asc'|'desc';
  onSortChange: (key: keyof Product) => void;
}

const columns: { key: keyof Product; label: string }[] = [
  { key: 'name', label: 'Название' },
  { key: 'price', label: 'Цена' },
  { key: 'discount_price', label: 'Цена со скидкой' },
  { key: 'rating', label: 'Рейтинг' },
  { key: 'reviews', label: 'Отзывы' },
];

export default function ProductTable({ products, sortKey, sortOrder, onSortChange }: Props) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
      <thead>
        <tr>
          {columns.map(col => (
            <th
              key={col.key}
              onClick={() => onSortChange(col.key)}
              style={{ cursor: 'pointer', borderBottom: '1px solid #aaa', padding: 8 }}
            >
              {col.label}
              {sortKey === col.key ? (sortOrder === 'asc' ? ' ↑' : ' ↓') : null}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {products.map(p => (
          <tr key={p.id}>
            <td style={{ padding: 8 }}>{p.name}</td>
            <td style={{ padding: 8 }}>{p.price}</td>
            <td style={{ padding: 8 }}>{p.discount_price}</td>
            <td style={{ padding: 8 }}>{p.rating.toFixed(1)}</td>
            <td style={{ padding: 8 }}>{p.reviews}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}