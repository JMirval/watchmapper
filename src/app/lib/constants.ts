import { BrandName, Reseller, ShopType } from "./types"
import rolexLogo from "@/public/brands/rolex.png"
import omegaLogo from "@/public/brands/omega.png"
import seikoLogo from "@/public/brands/seiko.png"
import citizenLogo from "@/public/brands/citizen.png"
import patekPhilippeLogo from "@/public/brands/patek-philippe.png"
import tissotLogo from "@/public/brands/tissot.png"

// Sample data for resellers/repair shops
export const RESELLERS: Reseller[] = [
  {
    id: 1,
    name: "Lyon Watch Repair",
    type: ShopType.Repair,
    brands: [BrandName.Rolex, BrandName.Omega],
    openNow: true,
    lat: 45.7602,
    lng: 4.8357,
    address: "12 Rue de la Montée, 69001 Lyon",
  },
  {
    id: 2,
    name: "Montres & Co Reseller",
    type: ShopType.Reseller,
    brands: [BrandName.Seiko, BrandName.Citizen],
    openNow: false,
    lat: 45.7485,
    lng: 4.8467,
    address: "8 Place Bellecour, 69002 Lyon",
  },
  {
    id: 3,
    name: "Luxury Time Lyon",
    type: ShopType.Reseller,
    brands: [BrandName.Rolex, BrandName.PatekPhilippe],
    openNow: true,
    lat: 45.7578,
    lng: 4.832,
    address: "5 Rue de la République, 69001 Lyon",
  },
  {
    id: 4,
    name: "Horlogerie du Rhône",
    type: ShopType.Repair,
    brands: [BrandName.Omega, BrandName.Tissot],
    openNow: false,
    lat: 45.7512,
    lng: 4.8571,
    address: "22 Quai du Rhône, 69006 Lyon",
  },
]

export const BRANDS = {
  [BrandName.Rolex]: { name: BrandName.Rolex, icon: rolexLogo.src },
  [BrandName.Omega]: { name: BrandName.Omega, icon: omegaLogo.src },
  [BrandName.Seiko]: { name: BrandName.Seiko, icon: seikoLogo.src },
  [BrandName.Citizen]: { name: BrandName.Citizen, icon: citizenLogo.src },
  [BrandName.PatekPhilippe]: { name: BrandName.PatekPhilippe, icon: patekPhilippeLogo.src },
  [BrandName.Tissot]: { name: BrandName.Tissot, icon: tissotLogo.src },
}
