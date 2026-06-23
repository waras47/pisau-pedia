export interface KnifeShape {
  id: string;
  name: string;
  category: string; // mis. "Multi-Purpose", "Vegetable"
  description?: string;
}

export interface KnifeBlade {
  id: string;
  shapeId: string; // relasi ke KnifeShape.id
  name: string;
  steel: string;
  lengthMm: number;
  price: number;
  compareAtPrice?: number;
}

export interface KnifeHandle {
  id: string;
  name: string;
  material: string;
  priceDelta: number;
}

export interface KnifeAccessory {
  id: string;
  name: string;
  price: number;
}
