'use client';

import { ShoppingCart } from 'lucide-react';

import { calcDiscount, cn, formatPrice } from '@/lib/utils';
import { Product } from '@/types';

import { Badge } from './Badge';
import { StarRating } from './StarRating';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const badgeVariantMap = {
  'Best Seller': 'gold',
  New: 'green',
  Sale: 'red',
  Limited: 'dark',
} as const;

export function ProductCard({ product, className }: ProductCardProps) {
  const discount =
    product.originalPrice ? calcDiscount(product.originalPrice, product.price) : null;

  return (
    <div
      className={cn(
        'group relative flex flex-col bg-[#111] border border-[#222] hover:border-[#C9A84C]/40 transition-colors duration-300',
        className
      )}
    >
      {/* Image area */}
      <div className="relative aspect-square overflow-hidden bg-[#1A1A1A]">
        {/* Placeholder image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-2">🔪</div>
            <p className="text-[#444] text-xs">{product.brand}</p>
          </div>
        </div>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <Badge variant={badgeVariantMap[product.badge]}>{product.badge}</Badge>
          </div>
        )}

        {/* Discount badge */}
        {discount && (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="red">-{discount}%</Badge>
          </div>
        )}

        {/* Quick add overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-3">
          <button
            className="w-full flex items-center justify-center gap-2 bg-[#C9A84C] text-[#0A0A0A] py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-[#B8963E] transition-colors"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={14} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <p className="text-[#888] text-xs uppercase tracking-widest">{product.brand}</p>
        <h3 className="text-white text-sm font-medium leading-snug line-clamp-2 group-hover:text-[#C9A84C] transition-colors">
          {product.name}
        </h3>

        <StarRating rating={product.rating} reviewCount={product.reviewCount} />

        <div className="mt-auto pt-2 flex items-center gap-2">
          <span className="text-[#C9A84C] font-semibold">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-[#555] text-sm line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {!product.inStock && (
          <p className="text-red-500 text-xs uppercase tracking-wide">Out of Stock</p>
        )}
      </div>
    </div>
  );
}
