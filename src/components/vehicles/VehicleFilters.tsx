import { SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { brands, bodyTypes, fuels, transmissions } from "@/data/vehicles";

export interface VehicleFilterState {
  brand: string;
  fuel: string;
  transmission: string;
  bodyType: string;
  minPrice: string;
  maxPrice: string;
  maxMileage: string;
  minYear: string;
  sort: string;
}

export const emptyFilters: VehicleFilterState = {
  brand: "all",
  fuel: "all",
  transmission: "all",
  bodyType: "all",
  minPrice: "",
  maxPrice: "",
  maxMileage: "",
  minYear: "",
  sort: "recientes",
};

interface Props {
  value: VehicleFilterState;
  onChange: (next: VehicleFilterState) => void;
  onReset: () => void;
}

function Fields({ value, onChange, onReset }: Props) {
  const set = (key: keyof VehicleFilterState, v: string) => onChange({ ...value, [key]: v });

  return (
    <div className="space-y-5">
      <div>
        <Label>Marca</Label>
        <Select value={value.brand} onValueChange={(v) => set("brand", v)}>
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las marcas</SelectItem>
            {brands.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Combustible</Label>
        <Select value={value.fuel} onValueChange={(v) => set("fuel", v)}>
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {fuels.map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Cambio</Label>
        <Select value={value.transmission} onValueChange={(v) => set("transmission", v)}>
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {transmissions.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Carrocería</Label>
        <Select value={value.bodyType} onValueChange={(v) => set("bodyType", v)}>
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {bodyTypes.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="minPrice">Precio mín.</Label>
          <Input
            id="minPrice"
            inputMode="numeric"
            placeholder="0 €"
            className="mt-1.5"
            value={value.minPrice}
            onChange={(e) => set("minPrice", e.target.value.replace(/\D/g, ""))}
          />
        </div>
        <div>
          <Label htmlFor="maxPrice">Precio máx.</Label>
          <Input
            id="maxPrice"
            inputMode="numeric"
            placeholder="50.000 €"
            className="mt-1.5"
            value={value.maxPrice}
            onChange={(e) => set("maxPrice", e.target.value.replace(/\D/g, ""))}
          />
        </div>
        <div>
          <Label htmlFor="maxMileage">Km máx.</Label>
          <Input
            id="maxMileage"
            inputMode="numeric"
            placeholder="150.000"
            className="mt-1.5"
            value={value.maxMileage}
            onChange={(e) => set("maxMileage", e.target.value.replace(/\D/g, ""))}
          />
        </div>
        <div>
          <Label htmlFor="minYear">Año desde</Label>
          <Input
            id="minYear"
            inputMode="numeric"
            placeholder="2018"
            className="mt-1.5"
            value={value.minYear}
            onChange={(e) => set("minYear", e.target.value.replace(/\D/g, ""))}
          />
        </div>
      </div>

      <Button variant="ghost" className="w-full" onClick={onReset}>
        <X /> Limpiar filtros
      </Button>
    </div>
  );
}

export function VehicleFilters(props: Props) {
  return (
    <>
      {/* Desktop */}
      <aside className="surface-card hidden h-fit rounded-lg p-5 lg:block">
        <h2 className="mb-5 font-display text-lg font-bold uppercase">Filtros</h2>
        <Fields {...props} />
      </aside>

      {/* Móvil: panel desplegable */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="lg" className="w-full">
              <SlidersHorizontal /> Filtrar vehículos
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto bg-surface">
            <SheetTitle className="mb-5 font-display text-lg uppercase">Filtros</SheetTitle>
            <Fields {...props} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
