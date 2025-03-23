// Type for the price information
export interface Price {
  fiatCurrency: string;
  fiatValue: string;
  stableCoinCurrency: string;
  stableCoinValue: string | number;
}

// Type for an individual product from the endpoint /api/v1/products/
export interface Variant {
  id: string;
  fupId: string;
  brand: string;
  country: string;
  notes: string | null;
  sku: string;
  price: Price;
  productType: string;
  shortNotes: string | null;
  subTypes: string[]; // Array of subtypes
  imageUrl: string | null;
  dataGB: number | null;
  dataSpeeds: number | null;
  dataUnlimited: boolean | null;
  durationDays: number | null;
  smsNumber: number | null;
  smsUnlimited: boolean | null;
  voiceMinutes: number | null;
  voiceUnlimited: boolean | null;
  sendCurrency: string | null;
  sendPrice: number | null;
}

// Type for a grouped brand
export interface BrandGroup {
    brandName: string;
    brandSlug: string;
    imageUrl: string | null;
    order: number;
    variants: Variant[];
}

// Type for products grouped by type
export interface GroupedProduct {
    productType: string;
    brands: BrandGroup[];
}

// Response type for the endpoint /api/v1/products/grouped/
export interface GroupedProductsResponse {
    products: GroupedProduct[];
}
