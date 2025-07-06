export interface Filters {
  type?: ShopType
  brands: BrandName[]
  openNow?: boolean
}

export enum ShopType {
  Reseller = "reseller",
  Repair = "repair",
}

export enum BrandName {
  Rolex = "Rolex",
  Omega = "Omega",
  Seiko = "Seiko",
  Citizen = "Citizen",
  PatekPhilippe = "Patek Philippe",
  Tissot = "Tissot",
}

export interface Brand {
  name: BrandName
  icon: string
}

export interface Reseller {
  id: number
  name: string
  type: ShopType
  brands: BrandName[]
  openNow: boolean
  lat: number
  lng: number
  address: string
}
