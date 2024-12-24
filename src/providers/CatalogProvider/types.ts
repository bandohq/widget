export interface ProductQueryResult {
    products: Product[]
}

export interface Product {
    productType: string
    brands: Brand[]
  }
  
export interface Brand {
    brandName: string
    brandSlug: string
    imageUrl: any
    order: number
    variants: Variant[]
}
  
export interface Variant {
    id: string
    fupId: string
    brand: string
    country: string
    notes: string
    sku: string
    price: Price
    productType: string
    referenceType: ReferenceType[]
    shortNotes: string
    subTypes: any[]
    imageUrl: any
    evmServiceId: number
    svmServiceId: number
    dataGB: any
    dataSpeeds: any
    dataUnlimited: any
    durationDays: any
    smsNumber: any
    smsUnlimited: any
    voiceMinutes: any
    voiceUnlimited: any
    sendCurrency?: string
    sendPrice?: number
}
  
export interface Price {
    fiatCurrency: string
    fiatValue: string
    stableCoinCurrency: string
    stableCoinValue: string
}
  
export interface ReferenceType {
    name: string
    valueType: string
    regex: any
}