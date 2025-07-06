"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Drawer } from "@/components/ui/drawer"
import { DrawerContent } from "@/components/ui/drawer"
import { Check, Edit2, Settings, Watch, Wrench, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import useFiltersStore from "@/stores/filters"
import { BrandName, ShopType } from "@/lib/types"
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

export default function FilterPanel() {
  const { filters, setFilters } = useFiltersStore()
  const [isMobile, setIsMobile] = useState(false)
  const [activeToggle, setActiveToggle] = useState<ShopType>(ShopType.Repair)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

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
        <Button className={`fixed bottom-4 right-4 rounded-full z-10`} aria-label="Toggle filters">
          <Settings className={`w-4 h-4`} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm z-[1000] p-4">
          <DrawerHeader>
            <DrawerTitle>Filters shops</DrawerTitle>
            <DrawerDescription>Set the filters to find the best shops.</DrawerDescription>
          </DrawerHeader>
          <div className={`flex flex-col gap-4`}>
            {/* iOS Style Toggle */}
            <ToggleGroup
              type="single"
              variant="outline"
              defaultValue={filters.type}
              className={`w-full`}
              onValueChange={handleToggleChange}
            >
              <ToggleGroupItem value={ShopType.Repair} aria-label="Toggle bold">
                <Wrench /> Repairs
              </ToggleGroupItem>
              <ToggleGroupItem value={ShopType.Reseller} aria-label="Toggle bold">
                <Watch /> Resellers
              </ToggleGroupItem>
            </ToggleGroup>

            <div className={`flex flex-col gap-1`}>
              <Label htmlFor="openNow" className={`flex items-center gap-2`}>
                <Checkbox
                  id="openNow"
                  checked={filters.openNow}
                  onCheckedChange={handleToggleOpenNow}
                />
                Open Now
              </Label>
            </div>

            <div className={`flex flex-col gap-1`}>
              <Label>Brand</Label>
              <div
                className={`flex flex-wrap gap-1 items-center justify-center border-1 p-2 rounded-md`}
              >
                {filters.brands.map((brand) => (
                  <Badge key={brand} variant="outline">
                    <Image src={BRANDS[brand].icon} alt={brand} width={40} height={40} />
                    {brand}
                    <Button variant="ghost" size="sm" onClick={() => handleBrandChange(brand)}>
                      <X />
                    </Button>
                  </Badge>
                ))}
              </div>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button aria-expanded={open} role="combobox" size="sm" className={`w-full`}>
                    <Edit2 />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search brand..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No brand found.</CommandEmpty>
                      <CommandGroup>
                        {Object.values(BRANDS).map((brand) => (
                          <CommandItem
                            key={brand.name}
                            value={brand.name}
                            onSelect={(currentValue) => {
                              handleBrandChange(currentValue as BrandName)
                            }}
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
