import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import type { Product } from './types';
import FilterPanel from './components/FilterPanel';
import ProductTable from './components/ProductTable';
import Charts from './components/Charts';
import PageSizeSelector from './components/PageSizeSelector';
import Pagination from './components/Pagination';
import SearchBox from './components/SearchBox';
import { WBSearch } from './components/WBSearch';

const API = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(0)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0])
  const [minRating, setMinRating] = useState(0)
  const [minReviews, setMinReviews] = useState(0)
  const [sortKey, setSortKey] = useState<keyof Product>('name')
  const [sortOrder, setSortOrder] = useState<'asc'|'desc'>('asc')
  const [searchQuery, setSearchQuery] = useState('')
  const [isParsing, setIsParsing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const didInit = useRef(false)

  useEffect(() => {
    async function init() {
      const { data } = await axios.get<Product[]>(`${API}/api/products`, {
        params: { min_price: 0, min_rating: 0, min_reviews: 0 }
      })
      setProducts(data)

      if (data.length > 0) {
        const prices = data.map(p => p.price)
        const lo = Math.min(...prices)
        const hi = Math.max(...prices)
        setMinPrice(lo)
        setMaxPrice(hi)
        setPriceRange([lo, hi])
      }
      didInit.current = true
    }
    init()
  }, [])

  const loadProducts = useCallback(async () => {
    const [lo, hi] = priceRange
    if (!isFinite(lo) || !isFinite(hi) || lo > hi) return

    const params: Record<string, number> = {
      min_price: lo,
      min_rating: minRating,
      min_reviews: minReviews,
    }
    if (hi >= lo) {
      params.max_price = hi
    }

    const { data } = await axios.get<Product[]>(`${API}/api/products`, { params })
    setProducts(data)
    setCurrentPage(1)
  }, [priceRange, minRating, minReviews])

  useEffect(() => {
    if (!didInit.current) return
    loadProducts()
  }, [loadProducts, sortKey, sortOrder])

  const handleSortChange = (key: keyof Product) => {
    if (key === sortKey) {
      setSortOrder(o => (o === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const handleParseWB = async (q: string) => {
    setIsParsing(true);
    try {
      await axios.post<{ parsed: number }>(`${API}/api/products/parse/${encodeURIComponent(q)}`);
      const { data } = await axios.get<Product[]>(`${API}/api/products`, {
        params: { min_price: 0, min_rating: 0, min_reviews: 0 }
      });
      setProducts(data);
      if (data.length > 0) {
        const prices = data.map(p => p.price);
        const lo = Math.min(...prices);
        const hi = Math.max(...prices);
        setMinPrice(lo);
        setMaxPrice(hi);
        setPriceRange([lo, hi]);
      }
      setCurrentPage(1);
    } finally {
      setIsParsing(false);
    }
  };

  const filtered = products
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      return sortOrder === 'asc'
        ? (aVal > bVal ? 1 : -1)
        : (aVal < bVal ? 1 : -1)
    })

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginateProducts = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div style={{ padding: 24, width: '100%', margin: '0 auto' }}>
      <h1>Каталог товаров</h1>
      <WBSearch
        onParse={handleParseWB}
        disabled={isParsing}
      />
      <FilterPanel
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        minPrice={minPrice}
        maxPrice={maxPrice}
        minRating={minRating}
        onMinRatingChange={setMinRating}
        minReviews={minReviews}
        onMinReviewsChange={setMinReviews}
      />
      <PageSizeSelector
        value={pageSize}
        onChange={value => {
          setPageSize(value);
          setCurrentPage(1);
        }}
      />
      <SearchBox
        value={searchQuery}
        onChange={v => {
          setSearchQuery(v);
          setCurrentPage(1);
        }}
      />
      <ProductTable
        products={paginateProducts}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={page => setCurrentPage(page)}
      />
      <Charts products={products} />
    </div>
  );
}

export default App;