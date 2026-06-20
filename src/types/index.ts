// Product types
export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  badge?: 'New' | 'Sale' | 'Best Seller' | 'Limited';
  isNew?: boolean;
  isFeatured?: boolean;
  description: string;
  specs: ProductSpec[];
  inStock: boolean;
}

export interface ProductSpec {
  label: string;
  value: string;
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

// Brand types
export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  country: string;
  description: string;
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
}

// Review types
export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
}

// Testimonial types
export interface Testimonial {
  id: string;
  author: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}
