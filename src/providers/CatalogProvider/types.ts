import { Variant } from "../../stores/ProductProvider/types";

export interface ProductQueryResult {
  products: Product[];
}

export interface Product {
  productType: string;
  brands: Brand[];
}

export interface Brand {
  brandName: string;
  brandSlug: string;
  imageUrl: any;
  order: number;
  variants: Variant[];
}

export interface ReferenceType {
  name: string;
  valueType: string;
  regex?: any;
}
