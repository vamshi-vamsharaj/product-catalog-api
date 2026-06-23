
const CATEGORY_COLORS: Record<string, string> = {
  'Electronics':   'bg-blue-500',
  'Clothing':      'bg-pink-500',
  'Books':         'bg-amber-500',
  'Home & Garden': 'bg-emerald-500',
  'Sports':        'bg-orange-500',
  'Automotive':    'bg-red-500',
};

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  created_at: string;
  updated_at: string;
}

interface ProductCardProps {
  product: Product;
}

function formatPrice(price: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(parseFloat(price));
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays}d ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

export function ProductCard({ product }: ProductCardProps) {
  const accentColor = CATEGORY_COLORS[product.category] ?? 'bg-zinc-500';

  return (
    <div
      className="
        group relative rounded-xl overflow-hidden cursor-default
        transition-all duration-200 ease-out
        bg-[hsl(var(--app-surface))]
        border border-[hsl(var(--app-border)/0.6)]
        hover:border-[hsl(var(--app-btn-hover-border))]
        hover:bg-[hsl(var(--app-row-hover))]
      "
    >
      {/* Category color accent — left edge stripe (theme-invariant) */}
      <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${accentColor}`} />

      <div className="p-4 pl-5">
        {/* Top row: category badge + date */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="
              inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium
              bg-[hsl(var(--app-tag-bg))]
              text-[hsl(var(--app-tag-text))]
              border border-[hsl(var(--app-border))]
            "
          >
            {product.category}
          </span>
          <span className="text-[11px] tabular-nums text-[hsl(var(--app-text-muted))]">
            {formatDate(product.updated_at)}
          </span>
        </div>

        {/* Product name */}
        <h3
          className="
            text-sm font-medium leading-snug mb-3 line-clamp-2
            transition-colors duration-150
            text-[hsl(var(--app-text-secondary))]
            group-hover:text-[hsl(var(--app-text-primary))]
          "
        >
          {product.name}
        </h3>

        {/* Bottom row: price + ID */}
        <div className="flex items-center justify-between">
          <span
            className="
              text-base font-semibold tabular-nums tracking-tight
              text-[hsl(var(--app-text-primary))]
            "
          >
            {formatPrice(product.price)}
          </span>
          <span
            className="
              text-[10px] font-mono tabular-nums opacity-50
              text-[hsl(var(--app-text-muted))]
            "
          >
            #{product.id}
          </span>
        </div>
      </div>
    </div>
  );
}