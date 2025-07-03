interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxButtons?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxButtons = 10,
}: Props) {
  if (totalPages === 0) return null;

  const numInner = maxButtons - 2;

  let start = 2;
  let end = totalPages - 1;

  if (totalPages > maxButtons) {
    const half = Math.floor(numInner / 2);
    start = Math.max(2, currentPage - half);
    end = start + numInner - 1;

    if (end >= totalPages) {
      end = totalPages - 1;
      start = end - numInner + 1;
    }
  }

  const pages: (number | 'dots')[] = [1];

  if (start > 2) {
    pages.push('dots');
  }

  for (let p = start; p <= end; p++) {
    pages.push(p);
  }

  if (end < totalPages - 1) {
    pages.push('dots');
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
      {pages.map((item, idx) => {
        if (item === 'dots') {
          return <span key={`dots-${idx}`}>…</span>;
        }
        const page = item as number;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={page === currentPage}
            style={{
              padding: '4px 10px',
              background: page === currentPage ? '#ccc' : '#eee',
              cursor: page === currentPage ? 'default' : 'pointer',
              color: '#242424'
            }}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
}