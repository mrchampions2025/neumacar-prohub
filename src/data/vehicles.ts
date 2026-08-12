import bmw1 from "@/assets/car-bmw1.jpg";
import audia3 from "@/assets/car-audia3.jpg";
import mercedesa from "@/assets/car-mercedesa.jpg";
import golf from "@/assets/car-golf.jpg";
import corolla from "@/assets/car-corolla.jpg";

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

export const stockVehicles: StockVehicle[] = [
  {
    id: "bmw-serie-1-118i",
    brand: "BMW",
    model: "Serie 1",
    version: "118i Sport 140 CV",
    year: 2021,
    mileage: 48200,
    fuel: "Gasolina",
    transmission: "Automático",
    power: 140,
    displacement: 1499,
    doors: 5,
    seats: 5,
    color: "Blanco Alpine",
    bodyType: "Compacto",
    envLabel: "C",
    price: 23900,
    financePrice: 22400,
    status: "publicado",
    isNew: true,
    images: [bmw1],
    description:
      "BMW Serie 1 en acabado Sport con cambio automático Steptronic. Un único propietario y mantenimiento al día en red oficial.",
    equipment: ["Navegador", "Cámara trasera", "Sensores de aparcamiento", "Faros LED", "Control de crucero", "Climatizador bizona", "Apple CarPlay", "Llantas 17\""],
    condition: {
      general: "Excelente",
      itv: "En vigor hasta 2027",
      maintenance: "Revisiones sellada en oficial",
      tyres: "4 neumáticos con más del 70%",
      brakes: "Discos y pastillas en buen estado",
      history: "1 propietario · sin siniestros declarados",
    },
  },
  {
    id: "audi-a3-30-tdi",
    brand: "Audi",
    model: "A3",
    version: "Sportback 30 TDI S line 116 CV",
    year: 2020,
    mileage: 76500,
    fuel: "Diésel",
    transmission: "Manual",
    power: 116,
    displacement: 1598,
    doors: 5,
    seats: 5,
    color: "Gris Daytona",
    bodyType: "Compacto",
    envLabel: "C",
    price: 19750,
    financePrice: 18500,
    status: "publicado",
    isOffer: true,
    images: [audia3],
    description:
      "Audi A3 Sportback S line con equipamiento deportivo, muy eficiente para uso diario y viajes largos.",
    equipment: ["Virtual Cockpit", "Navegador MMI", "Sensores traseros", "Faros LED", "Control de crucero", "Volante multifunción", "Tapicería mixta"],
    condition: {
      general: "Muy bueno",
      itv: "En vigor hasta 2026",
      maintenance: "Distribución realizada",
      tyres: "Delanteros nuevos",
      brakes: "Pastillas sustituidas recientemente",
      history: "2 propietarios",
    },
  },
  {
    id: "mercedes-clase-a-180d",
    brand: "Mercedes-Benz",
    model: "Clase A",
    version: "A 180 d AMG Line 116 CV",
    year: 2022,
    mileage: 39800,
    fuel: "Diésel",
    transmission: "Automático",
    power: 116,
    displacement: 1950,
    doors: 5,
    seats: 5,
    color: "Negro Cosmos",
    bodyType: "Compacto",
    envLabel: "C",
    price: 27500,
    financePrice: 25900,
    status: "publicado",
    images: [mercedesa],
    description:
      "Mercedes Clase A con paquete AMG Line, doble pantalla MBUX y cambio automático 8G-DCT. Estado impecable.",
    equipment: ["MBUX doble pantalla", "Navegador", "Cámara 360", "Asientos calefactados", "Techo panorámico", "Faros LED High Performance", "Cuero sintético ARTICO"],
    condition: {
      general: "Excelente",
      itv: "No requiere hasta 2026",
      maintenance: "Mantenimiento oficial completo",
      tyres: "Los cuatro al 80%",
      brakes: "Sin desgaste relevante",
      history: "1 propietario",
    },
  },
  {
    id: "vw-golf-1-5-tsi",
    brand: "Volkswagen",
    model: "Golf",
    version: "1.5 TSI Life 130 CV",
    year: 2021,
    mileage: 58300,
    fuel: "Gasolina",
    transmission: "Manual",
    power: 130,
    displacement: 1498,
    doors: 5,
    seats: 5,
    color: "Azul Atlantic",
    bodyType: "Compacto",
    envLabel: "C",
    price: 21400,
    status: "reservado",
    images: [golf],
    description:
      "Golf VIII 1.5 TSI en acabado Life, con Digital Cockpit y asistentes de conducción. Reservado pendiente de entrega.",
    equipment: ["Digital Cockpit", "Navegador Discover", "Front Assist", "Faros LED", "Control de crucero adaptativo", "Climatizador"],
    condition: {
      general: "Muy bueno",
      itv: "En vigor",
      maintenance: "Revisión reciente",
      tyres: "Buen estado",
      brakes: "Correcto",
      history: "1 propietario",
    },
  },
  {
    id: "toyota-corolla-125h",
    brand: "Toyota",
    model: "Corolla",
    version: "125H Active Tech híbrido 122 CV",
    year: 2022,
    mileage: 44100,
    fuel: "Híbrido",
    transmission: "Automático",
    power: 122,
    displacement: 1798,
    doors: 5,
    seats: 5,
    color: "Plata Metalizado",
    bodyType: "Sedán",
    envLabel: "ECO",
    price: 22900,
    financePrice: 21600,
    status: "publicado",
    isOffer: true,
    images: [corolla],
    description:
      "Toyota Corolla híbrido autorecargable, etiqueta ECO y consumos muy bajos en ciudad. Ideal para uso urbano intensivo.",
    equipment: ["Navegador", "Cámara trasera", "Toyota Safety Sense", "Control de crucero adaptativo", "Faros LED", "Bluetooth", "Llantas 16\""],
    condition: {
      general: "Excelente",
      itv: "No requiere hasta 2026",
      maintenance: "Mantenimiento híbrido al día",
      tyres: "Los cuatro al 75%",
      brakes: "Muy bajo desgaste (frenada regenerativa)",
      history: "1 propietario",
    },
  },
];

export const getVehicle = (id: string) => stockVehicles.find((v) => v.id === id);

export const vehicleTitle = (v: StockVehicle) => `${v.brand} ${v.model} ${v.version}`;

export const brands = [...new Set(stockVehicles.map((v) => v.brand))].sort();
export const fuels: Fuel[] = ["Gasolina", "Diésel", "Híbrido", "Eléctrico", "GLP"];
export const transmissions: Transmission[] = ["Manual", "Automático"];
export const bodyTypes = [...new Set(stockVehicles.map((v) => v.bodyType))].sort();
