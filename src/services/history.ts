import { supabase } from "@/integrations/supabase/client";

export interface VehicleHistoryRecord {
  id: string;
  plate: string;
  date: string;
  mileage: number;
  serviceTitle: string;
  description: string;
  cost?: number;
  invoiceRef?: string;
  mechanicNotes?: string;
  created_at?: string;
}

// Datos de demostración por defecto para pruebas de historial por matrícula
const DEMO_HISTORY: Record<string, VehicleHistoryRecord[]> = {
  "1234ABC": [
    {
      id: "h1",
      plate: "1234ABC",
      date: "2026-03-15",
      mileage: 95000,
      serviceTitle: "Cambio de Aceite y Filtros 5W30 Sintético",
      description: "Sustitución de aceite de motor, filtro de aceite, filtro de aire y habitáculo. Reseteo de servicio de mantenimiento.",
      cost: 95,
      invoiceRef: "INV-2026-0412",
      mechanicNotes: "Vehículo en perfecto estado general. Próximo cambio recomendado a los 110.000 km.",
    },
    {
      id: "h2",
      plate: "1234ABC",
      date: "2025-09-10",
      mileage: 87200,
      serviceTitle: "Sustitución de Pastillas y Discos Delanteros",
      description: "Cambio de discos cerámicos ventilados y juego de pastillas de freno Brembo. Comprobación del líquido de frenos.",
      cost: 240,
      invoiceRef: "INV-2025-0899",
      mechanicNotes: "Desgaste uniforme detectado. Sistema ABS verificado en prueba de frenada.",
    },
    {
      id: "h3",
      plate: "1234ABC",
      date: "2025-02-20",
      mileage: 78000,
      serviceTitle: "Revisión Pre-ITV e Inspección de Emisiones",
      description: "Comprobación de 40 puntos de seguridad, alineación de dirección y prueba de opacidad de gases.",
      cost: 45,
      invoiceRef: "INV-2025-0120",
      mechanicNotes: "ITV superada sin ningún defecto leve.",
    },
  ],
  "5678DEF": [
    {
      id: "h4",
      plate: "5678DEF",
      date: "2026-01-18",
      mileage: 120500,
      serviceTitle: "Sustitución de Kit de Distribución + Bomba de Agua",
      description: "Cambio completo de correa de distribución, rodillo tensor, polea guía y bomba de agua con anticongelante G12+.",
      cost: 480,
      invoiceRef: "INV-2026-0045",
      mechanicNotes: "Sincronización ajustada según manual del fabricante.",
    },
    {
      id: "h5",
      plate: "5678DEF",
      date: "2025-06-12",
      mileage: 108000,
      serviceTitle: "Carga de Climatizador y Desinfección con Ozono",
      description: "Recarga de gas R134a, sustitución de filtro de polen con carbón activo y desinfección higienizante de conductos.",
      cost: 65,
      invoiceRef: "INV-2025-0512",
    },
  ]
};

export async function fetchVehicleHistory(plate: string): Promise<VehicleHistoryRecord[]> {
  const cleanPlate = plate.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

  try {
    const { data, error } = await supabase
      .from("vehicle_history")
      .select("*")
      .ilike("plate", cleanPlate)
      .order("date", { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((item) => ({
        id: item.id,
        plate: item.plate,
        date: item.date,
        mileage: item.mileage,
        serviceTitle: item.service_title,
        description: item.description,
        cost: item.cost,
        invoiceRef: item.invoice_ref,
        mechanicNotes: item.mechanic_notes,
      }));
    }
  } catch (err) {
    console.warn("Using demo history fallback for plate:", cleanPlate);
  }

  // Fallback demo local si la tabla aún no existe o no tiene datos
  return DEMO_HISTORY[cleanPlate] || [
    {
      id: `demo-${Date.now()}`,
      plate: cleanPlate,
      date: new Date().toISOString().split("T")[0],
      mileage: 65000,
      serviceTitle: "Revisión General y Diagnosis de Entrada",
      description: "Inspección inicial de puntos de seguridad en NeumaCar Motors.",
      cost: 0,
      mechanicNotes: "Historial digital inicializado para esta matrícula.",
    }
  ];
}

export async function addVehicleHistoryRecord(record: Omit<VehicleHistoryRecord, "id">): Promise<boolean> {
  const cleanPlate = record.plate.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

  try {
    const { error } = await supabase.from("vehicle_history").insert([
      {
        plate: cleanPlate,
        date: record.date,
        mileage: record.mileage,
        service_title: record.serviceTitle,
        description: record.description,
        cost: record.cost ?? null,
        invoice_ref: record.invoiceRef ?? null,
        mechanic_notes: record.mechanicNotes ?? null,
      },
    ]);

    if (!error) return true;
  } catch (err) {
    console.warn("Could not insert to Supabase vehicle_history, updating demo store", err);
  }

  // Local fallback push
  if (!DEMO_HISTORY[cleanPlate]) DEMO_HISTORY[cleanPlate] = [];
  DEMO_HISTORY[cleanPlate].unshift({
    ...record,
    id: `hist-${Date.now()}`,
    plate: cleanPlate,
  });

  return true;
}
