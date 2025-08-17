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
  const [value, setValue] = useState("")
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
          className={`fixed bottom-4 right-4 rounded-full z-10`}
          aria-label={t("toggleFilters")}
        >
          <Settings className={`w-4 h-4`} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm z-[1000] p-6">
          <DrawerHeader className="pb-4">
            <DrawerTitle>{t("title")}</DrawerTitle>
            <DrawerDescription>{t("description")}</DrawerDescription>
          </DrawerHeader>
          <div className={`flex flex-col gap-6`}>
            {/* iOS Style Toggle */}
            <ToggleGroup
              type="single"
              variant="outline"
              defaultValue={filters.type}
              className={`w-full`}
              onValueChange={handleToggleChange}
            >
              <ToggleGroupItem
                value={ShopType.Repair}
                aria-label={t("repairShops")}
                className="flex-1 px-4 py-3"
              >
                <Wrench className="mr-2" /> {t("repairShops")}
              </ToggleGroupItem>
              <ToggleGroupItem
                value={ShopType.Reseller}
                aria-label={t("resellerShops")}
                className="flex-1 px-4 py-3"
              >
                <Watch className="mr-2" /> {t("resellerShops")}
              </ToggleGroupItem>
            </ToggleGroup>

            <div className={`flex flex-col gap-3`}>
              <Label htmlFor="openNow" className={`flex items-center gap-3`}>
                <Checkbox
                  id="openNow"
                  checked={filters.openNow}
                  onCheckedChange={handleToggleOpenNow}
                />
                {t("openNow")}
              </Label>
            </div>

            <div className={`flex flex-col gap-3`}>
              <Label>{t("brand")}</Label>
              <div
                className={`flex flex-wrap gap-2 items-center justify-center border-1 p-4 rounded-md min-h-[60px]`}
              >
                {filters.brands.map((brand) => (
                  <Badge key={brand} variant="outline" className="px-3 py-2">
                    <Image src={BRANDS[brand].icon} alt={brand} width={40} height={40} />
                    {brand}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBrandChange(brand)}
                      className="ml-2 p-1"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button aria-expanded={open} role="combobox" size="sm" className={`w-full py-3`}>
                    <Edit2 className="mr-2" />
                    {t("addBrand")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder={t("searchBrand")} className="h-9" />
                    <CommandList>
                      <CommandEmpty>{t("noBrandFound")}</CommandEmpty>
                      <CommandGroup>
                        {Object.values(BRANDS).map((brand) => (
                          <CommandItem
                            key={brand.name}
                            value={brand.name}
                            onSelect={(currentValue) => {
                              handleBrandChange(currentValue as BrandName)
                            }}
                            className="px-4 py-3"
                          >
                            <Image src={brand.icon} alt={brand.name} width={40} height={40} />
                            {brand.name}
                            <Check
                              className={cn(
                                "ml-auto",
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
          {/* <DrawerFooter className={`w-full px-0`}>
            <Button>Apply</Button>
            <DrawerClose asChild>
              <Button variant="outline">Reset</Button>
            </DrawerClose>
          </DrawerFooter> */}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
