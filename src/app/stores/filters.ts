import { BrandName, Filters } from "@/lib/types"
import { create } from "zustand"

interface FiltersState {
  filters: Filters
  setFilters: (filters: Filters) => void
}

const useFiltersStore = create<FiltersState>()((set) => ({
  filters: {
    brands: Object.values(BrandName) as BrandName[],
    openNow: false,
  },
  setFilters: (filters) => set({ filters }),
}))

export default useFiltersStore
