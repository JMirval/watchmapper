"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Drawer } from "@/components/ui/drawer"
import { DrawerContent } from "@/components/ui/drawer"
import { Check, Edit2, Settings, Watch, Wrench, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import useFiltersStore from "@/stores/filters"
import { BrandName, ShopType } from "@/types"
import { Badge } from "@/components/ui/badge"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { CommandEmpty, CommandInput, CommandItem, Command } from "@/components/ui/command"
import { CommandGroup } from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CommandList } from "@/components/ui/command"
import { Popover } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { BRANDS } from "@/lib/constants"
import Image from "next/image"
import { useTranslations } from "next-intl"

export default function FilterPanel() {
  const { filters, setFilters } = useFiltersStore()
  const [isMobile, setIsMobile] = useState(false)
  const [activeToggle, setActiveToggle] = useState<ShopType>(ShopType.Repair)
  const [open, setOpen] = useState(false)
  const t = useTranslations("filters")

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)

    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  const handleToggleChange = (type: ShopType) => {
    setActiveToggle(type)
    setFilters({ ...filters, type })
  }

  const handleToggleOpenNow = (checked: boolean) => {
    setFilters({
      ...filters,
      openNow: checked,
    })
  }

  const handleBrandChange = (brand: BrandName) => {
    setFilters({
      ...filters,
      brands: filters.brands.includes(brand)
        ? filters.brands.filter((b) => b !== brand)
        : [...filters.brands, brand],
    })
  }

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button
          className="fixed bottom-4 right-4 rounded-full z-10 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-110 border-0"
          aria-label={t("toggleFilters")}
        >
          <Settings className="w-5 h-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm z-[1000] p-6">
          <DrawerHeader className="pb-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white -m-6 p-6">
            <DrawerTitle className="text-xl font-bold text-purple-100">{t("title")}</DrawerTitle>
            <DrawerDescription className="text-purple-100">{t("description")}</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-6 mt-4">
            {/* Enhanced Toggle Group */}
            <ToggleGroup
              type="single"
              variant="outline"
              defaultValue={filters.type}
              className="w-full"
              onValueChange={handleToggleChange}
            >
              <ToggleGroupItem
                value={ShopType.Repair}
                aria-label={t("repairShops")}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 border-red-200 text-red-800 font-semibold transition-all duration-200 hover:scale-105 data-[state=on]:bg-gradient-to-r data-[state=on]:from-red-500 data-[state=on]:to-orange-500 data-[state=on]:text-white data-[state=on]:border-red-500"
              >
                <Wrench className="mr-2 h-5 w-5" /> {t("repairShops")}
              </ToggleGroupItem>
              <ToggleGroupItem
                value={ShopType.Reseller}
                aria-label={t("resellerShops")}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border-purple-200 text-purple-800 font-semibold transition-all duration-200 hover:scale-105 data-[state=on]:bg-gradient-to-r data-[state=on]:from-purple-500 data-[state=on]:to-indigo-500 data-[state=on]:text-white data-[state=on]:border-purple-500"
              >
                <Watch className="mr-2 h-5 w-5" /> {t("resellerShops")}
              </ToggleGroupItem>
            </ToggleGroup>

            <div className="flex flex-col gap-3">
              <Label
                htmlFor="openNow"
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border border-green-200 hover:shadow-md transition-all duration-200"
              >
                <Checkbox
                  id="openNow"
                  checked={filters.openNow}
                  onCheckedChange={handleToggleOpenNow}
                  className="text-green-600 border-emerald-500"
                />
                <span className="font-semibold text-emerald-700">{t("openNow")}</span>
              </Label>
            </div>

            <div className="flex flex-col gap-3">
              <Label className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></span>
                {t("brand")}
              </Label>
              <div className="flex flex-wrap gap-2 items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-xl min-h-[80px] bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 transition-all duration-300">
                {filters.brands.map((brand) => (
                  <Badge
                    key={brand}
                    variant="outline"
                    className="px-1 py-1 bg-gradient-to-r from-blue-100 to-purple-100 border-blue-300 text-blue-800 font-semibold hover:shadow-md transition-all duration-200 hover:scale-105"
                  >
                    <Image
                      src={BRANDS[brand].icon}
                      alt={brand}
                      width={32}
                      height={32}
                      className="rounded-sm"
                    />
                    <span className="ml-2">{brand}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBrandChange(brand)}
                      className="ml-2 p-1 hover:bg-red-100 hover:text-red-600 transition-all duration-200"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                {filters.brands.length === 0 && (
                  <div className="text-gray-500 text-center text-sm">
                    <Watch className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>{t("noBrandsSelected")}</p>
                  </div>
                )}
              </div>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    aria-expanded={open}
                    role="combobox"
                    size="sm"
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border-0"
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    {t("addBrand")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 shadow-2xl border-0">
                  <Command>
                    <CommandInput placeholder={t("searchBrand")} className="h-12 text-lg" />
                    <CommandList>
                      <CommandEmpty className="p-4 text-center text-gray-500">
                        <Watch className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        {t("noBrandFound")}
                      </CommandEmpty>
                      <CommandGroup>
                        {Object.values(BRANDS).map((brand) => (
                          <CommandItem
                            key={brand.name}
                            value={brand.name}
                            onSelect={(currentValue) => {
                              handleBrandChange(currentValue as BrandName)
                            }}
                            className="px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 cursor-pointer"
                          >
                            <Image
                              src={brand.icon}
                              alt={brand.name}
                              width={40}
                              height={40}
                              className="rounded-sm"
                            />
                            <span className="ml-3 font-medium">{brand.name}</span>
                            <Check
                              className={cn(
                                "ml-auto h-5 w-5 text-green-600",
                                filters.brands.includes(brand.name) ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
