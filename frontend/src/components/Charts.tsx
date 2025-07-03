import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from 'recharts';
import type { Product } from '../types';

interface Props { products: Product[] }

export default function Charts({ products }: Props) {
  const buckets = 10;
  const prices = products.map(p => p.price);
  const minP = Math.min(...prices), maxP = Math.max(...prices);
  const step = (maxP - minP) / buckets;
  const hist: { range: string; count: number }[] = [];
  for (let i = 0; i < buckets; i++) {
    const lo = minP + step * i;
    const hi = lo + step;
    const count = products.filter(p => p.price >= lo && p.price < hi).length;
    hist.push({ range: `${Math.round(lo)}–${Math.round(hi)}`, count });
  }

  const discData = products
    .map(p => ({ rating: p.rating, discount: p.price - p.discount_price }))
    .sort((a, b) => a.rating - b.rating);

  return (
    <div style={{ display: 'flex', gap: 48 }}>
      <div>
        <h3>Гистограмма цен</h3>
        <BarChart width={400} height={300} data={hist}>
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" />
        </BarChart>
      </div>
      <div>
        <h3>Скидка vs Рейтинг</h3>
        <LineChart width={400} height={300} data={discData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="rating" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="discount" dot={false} />
        </LineChart>
      </div>
    </div>
  );
}