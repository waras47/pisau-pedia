export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number;
  category_id: string;
  category_name?: string;
  maker: string;
  badge: string;
  stock: number;
  sku: string;
  rating: number;
  review_count: number;
  is_active: boolean;
  images: ApiProductImage[];
  specs: ApiProductSpec[];
  highlights: ApiProductHighlight[];
  created_at: string;
  updated_at: string;
}

export interface ApiProductImage {
  id: string;
  url: string;
  alt: string;
  sort_order: number;
}

export interface ApiProductSpec {
  id: string;
  label: string;
  value: string;
}

export interface ApiProductHighlight {
  id: string;
  text: string;
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
}

export interface ApiCollection {
  id: string;
  name: string;
  handle: string;
  description: string;
  image_url: string;
  is_active: boolean;
}

export interface ApiReview {
  id: string;
  product_id: string;
  user_id: string;
  author: string;
  rating: number;
  comment: string;
  status: string;
  created_at: string;
}

export interface ApiOrder {
  id: string;
  user_id: string;
  order_number: string;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  notes: string;
  subtotal: number;
  discount: number;
  total: number;
  status: string;
  payment_url: string;
  items: ApiOrderItem[];
  created_at: string;
}

export interface ApiOrderItem {
  id: string;
  product_name: string;
  product_slug: string;
  quantity: number;
  price: number;
  total: number;
}

export interface ApiKnifeShape {
  id: string;
  name: string;
  category: string;
  image_url: string;
  sort_order: number;
}

export interface ApiKnifeBlade {
  id: string;
  shape_id: string;
  name: string;
  steel: string;
  length_mm: number;
  price: number;
  compare_at_price: number;
  image_url: string;
}

export interface ApiKnifeHandle {
  id: string;
  name: string;
  material: string;
  price_delta: number;
  image_url: string;
}

export interface ApiKnifeAccessory {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

export interface ApiCoupon {
  id: string;
  code: string;
  description: string;
  discount_type: string;
  discount_value: number;
  min_purchase: number;
  max_uses: number;
  used_count: number;
  is_active: boolean;
  expires_at: string;
}

export interface ApiAuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface ApiUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

export interface ApiAuthResponse {
  user: ApiUser;
  tokens: ApiAuthTokens;
}
