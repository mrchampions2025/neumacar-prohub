import bmw1 from "@/assets/car-bmw1.jpg";
import audia3 from "@/assets/car-audia3.jpg";
import mercedesa from "@/assets/car-mercedesa.jpg";
import golf from "@/assets/car-golf.jpg";
import corolla from "@/assets/car-corolla.jpg";

import { supabase } from "@/integrations/supabase/client";

/**
 * DATOS DE DEMOSTRACIÓN — los vehículos no son stock real.
 * Sustituir por la tabla `stock_vehicles` + `vehicle_images` de Lovable Cloud.
 */
export type VehicleStatus = "borrador" | "publicado" | "reservado" | "vendido" | "retirado";
export type Fuel = "Gasolina" | "Diésel" | "Híbrido" | "Eléctrico" | "GLP";
export type Transmission = "Manual" | "Automático";

export interface StockVehicle {
  id: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  mileage: number;
  fuel: Fuel;
  transmission: Transmission;
  power: number;
  displacement: number;
  doors: number;
  seats: number;
  color: string;
  bodyType: string;
  envLabel: "0" | "ECO" | "C" | "B";
  price: number;
  financePrice?: number;
  status: VehicleStatus;
  isNew?: boolean;
  isOffer?: boolean;
  images: string[];
  description: string;
  equipment: string[];
  condition: {
    general: string;
    itv: string;
    maintenance: string;
    tyres: string;
    brakes: string;
    history: string;
  };
}

export async function fetchPublishedVehicles(): Promise<StockVehicle[]> {
  const { data, error } = await supabase
    .from("stock_vehicles")
    .select("*")
    .eq("status", "publicado")
    .order("price", { ascending: true });

  if (error) {
    console.error("Error fetching published vehicles:", error);
    return [];
  }
  return data as unknown as StockVehicle[];
}

export async function fetchAllVehicles(): Promise<StockVehicle[]> {
  const { data, error } = await supabase
    .from("stock_vehicles")
    .select("*")
    .order("brand", { ascending: true });

  if (error) {
    console.error("Error fetching all vehicles:", error);
    return [];
  }
  return data as unknown as StockVehicle[];
}

export async function fetchVehicleById(id: string): Promise<StockVehicle | null> {
  const { data, error } = await supabase.from("stock_vehicles").select("*").eq("id", id).single();

  if (error) {
    console.error("Error fetching vehicle by id:", error);
    return null;
  }
  return data as unknown as StockVehicle;
}

export const vehicleTitle = (v: StockVehicle) => `${v.brand} ${v.model} ${v.version}`;

// Mantenemos estas listas estáticas para los filtros de la interfaz
export const brands = [
  "Audi",
  "BMW",
  "Mercedes-Benz",
  "Volkswagen",
  "Toyota",
  "SEAT",
  "Renault",
  "Peugeot",
  "Ford",
  "Hyundai",
  "Kia",
  "Volvo",
  "Porsche",
].sort();

export const fuels: Fuel[] = ["Gasolina", "Diésel", "Híbrido", "Eléctrico", "GLP"];
export const transmissions: Transmission[] = ["Manual", "Automático"];
export const bodyTypes = [
  "Compacto",
  "Sedán",
  "SUV",
  "Familiar",
  "Coupé",
  "Cabrio",
  "Monovolumen",
  "Furgoneta",
].sort();
