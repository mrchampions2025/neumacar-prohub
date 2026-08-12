import { useState } from "react";
import { Search } from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { whatsapp } from "@/services/whatsapp";

const WIDTHS = ["155", "165", "175", "185", "195", "205", "215", "225", "235", "245", "255", "265"];
const PROFILES = ["35", "40", "45", "50", "55", "60", "65", "70", "75", "80"];
const DIAMETERS = ["14", "15", "16", "17", "18", "19", "20", "21"];

/**
 * Buscador de neumáticos. No existe catálogo conectado: el formulario compone
 * una consulta que el cliente envía al taller. Punto de integración futuro:
 * API del proveedor de neumáticos (búsqueda por medida y por matrícula).
 */
export function TyreSearchForm() {
  const [width, setWidth] = useState("");
  const [profile, setProfile] = useState("");
  const [diameter, setDiameter] = useState("");
  const [load, setLoad] = useState("");
  const [speed, setSpeed] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [plate, setPlate] = useState("");

  const size = width && profile && diameter ? `${width}/${profile} R${diameter}` : "";
  const query = [
    size && `medida ${size}`,
    load && `índice de carga ${load}`,
    speed && `código de velocidad ${speed}`,
    brand && `marca ${brand}`,
    model && `modelo ${model}`,
    plate && `matrícula ${plate}`,
  ]
    .filter(Boolean)
    .join(", ");

  const message = query
    ? `Hola, quiero consultar neumáticos: ${query}.`
    : "Hola, quiero consultar neumáticos para mi vehículo.";

  return (
    <div className="surface-card rounded-lg p-6">
      <h3 className="font-display text-xl font-bold uppercase">Buscador de neumáticos</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Indica la medida que aparece en el flanco de tu neumático o los datos de tu vehículo.
      </p>

      <Tabs defaultValue="medida" className="mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="medida">Por medida</TabsTrigger>
          <TabsTrigger value="vehiculo">Por vehículo</TabsTrigger>
        </TabsList>

        <TabsContent value="medida" className="mt-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Anchura</Label>
              <Select value={width} onValueChange={setWidth}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="205" />
                </SelectTrigger>
                <SelectContent>
                  {WIDTHS.map((w) => (
                    <SelectItem key={w} value={w}>{w}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Perfil</Label>
              <Select value={profile} onValueChange={setProfile}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="55" />
                </SelectTrigger>
                <SelectContent>
                  {PROFILES.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Diámetro</Label>
              <Select value={diameter} onValueChange={setDiameter}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="16" />
                </SelectTrigger>
                <SelectContent>
                  {DIAMETERS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="load">Índice de carga</Label>
              <Input id="load" className="mt-1.5" placeholder="91" value={load} onChange={(e) => setLoad(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="speed">Código de velocidad</Label>
              <Input id="speed" className="mt-1.5" placeholder="V" value={speed} onChange={(e) => setSpeed(e.target.value)} />
            </div>
          </div>
          {size && (
            <p className="rounded-md border border-border bg-muted/40 p-3 text-sm">
              Medida seleccionada: <strong className="text-primary">{size}</strong>
            </p>
          )}
        </TabsContent>

        <TabsContent value="vehiculo" className="mt-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="t-brand">Marca</Label>
              <Input id="t-brand" className="mt-1.5" placeholder="Seat" value={brand} onChange={(e) => setBrand(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="t-model">Modelo</Label>
              <Input id="t-model" className="mt-1.5" placeholder="León" value={model} onChange={(e) => setModel(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="t-plate">Matrícula (opcional)</Label>
              <Input id="t-plate" className="mt-1.5" placeholder="1234 ABC" value={plate} onChange={(e) => setPlate(e.target.value)} />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="hero" size="lg" className="flex-1">
          <a href={whatsapp.link(message)} target="_blank" rel="noopener noreferrer">
            <Search /> Consultar neumáticos
          </a>
        </Button>
        <Button asChild variant="outline" size="lg" className="flex-1">
          <a href={whatsapp.link(`Hola, quiero solicitar montaje de neumáticos${size ? ` (${size})` : ""}.`)} target="_blank" rel="noopener noreferrer">
            Solicitar montaje
          </a>
        </Button>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        El catálogo de proveedores todavía no está conectado: tu consulta nos llega para que te
        confirmemos disponibilidad y precio.
      </p>
    </div>
  );
}
