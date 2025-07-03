interface Props {
  priceRange: [number,number];
  minPrice: number;
  maxPrice: number;
  onPriceRangeChange: (r: [number,number]) => void;
  minRating: number;
  onMinRatingChange: (v: number) => void;
  minReviews: number;
  onMinReviewsChange: (v: number) => void;
}

export default function FilterPanel({
  priceRange, minPrice, maxPrice, onPriceRangeChange,
  minRating, onMinRatingChange, minReviews, onMinReviewsChange
}: Props) {
  return (
    <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
      <div>
        <label>Цена: {priceRange[0]} – {priceRange[1]}</label><br/>
        <input
          type="range" min={minPrice} max={maxPrice}
          value={priceRange[0]}
          onChange={e => onPriceRangeChange([+e.target.value, priceRange[1]])}
        />
        <input
          type="range" min={minPrice} max={maxPrice}
          value={priceRange[1]}
          onChange={e => onPriceRangeChange([priceRange[0], +e.target.value])}
        />
      </div>
      <div>
        <label>Мин. рейтинг:</label><br/>
        <input
          type="number" step="0.1" min={0} max={5}
          value={minRating}
          onChange={e => onMinRatingChange(+e.target.value)}
        />
      </div>
      <div>
        <label>Мин. отзывов:</label><br/>
        <input
          type="number" min={0}
          value={minReviews}
          onChange={e => onMinReviewsChange(+e.target.value)}
        />
      </div>
    </div>
  );
}