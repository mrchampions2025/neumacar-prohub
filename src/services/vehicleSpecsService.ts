/**
 * Servicio de Autorellenado Inteligente de Especificaciones y Equipamiento de Vehículos
 * Genera datos técnicos, descripciones comerciales y equipamiento formateado con '·'.
 */

export interface SuggestedVehicleSpecs {
  fuel: string;
  transmission: string;
  power: number;
  displacement: number;
  doors: number;
  seats: number;
  bodyType: string;
  description: string;
  equipment: string[];
}

export function autoFillVehicleSpecs(
  brand: string,
  model: string,
  year: number = new Date().getFullYear(),
  versionStr: string = ""
): SuggestedVehicleSpecs {
  const b = (brand || "").trim().toLowerCase();
  const m = (model || "").trim().toLowerCase();
  const v = (versionStr || "").trim().toLowerCase();

  // Caso MG MG3 / MG4 / MG ZS
  if (b.includes("mg")) {
    if (m.includes("mg3") || m.includes("3")) {
      return {
        fuel: "Híbrido",
        transmission: "Automático",
        power: 195,
        displacement: 1498,
        doors: 5,
        seats: 5,
        bodyType: "Compacto",
        description: `MG MG3 Hybrid+ en impecable estado. Utilitario híbrido autorrecargable de 195 CV con distinción ambiental ECO de la DGT. Vehículo muy ágil y dinámico, ideal tanto para desplazamientos urbanos con consumo de solo 4.4 l/100 km como para carretera. Totalmente revisado en nuestros talleres Neumacar Motors con garantía oficial.`,
        equipment: [
          "· Sistema de propulsión híbrido Hybrid+ (143 kW / 195 CV)",
          "· Cuadro de instrumentos digital de 7\"",
          "· Pantalla táctil central HD de 10,25\"",
          "· Sistema de navegación integrado",
          "· Apple CarPlay y Android Auto",
          "· Cámara de marcha atrás con guías dinámicas",
          "· Sensores de aparcamiento traseros",
          "· Paquete de seguridad MG Pilot",
          "· Control de crucero adaptativo (ACC)",
          "· Asistente de mantenimiento de carril",
          "· Sistema de frenado automático de emergencia",
          "· Climatizador automático",
          "· Freno de estacionamiento eléctrico con Auto-Hold",
          "· Encendido automático de luces",
          "· Retrovisores exteriores ajustables eléctricamente",
          "· Volante multifunción"
        ]
      };
    }
    if (m.includes("mg4") || m.includes("4")) {
      return {
        fuel: "Eléctrico",
        transmission: "Automático",
        power: 170,
        displacement: 0,
        doors: 5,
        seats: 5,
        bodyType: "Compacto",
        description: `MG MG4 Electric 100% Eléctrico con etiqueta CERO Emisiones de la DGT. Gran autonomía urbana y de carretera, conducción suave y silenciosa. Equipado con batería de alta eficiencia, carga rápida y la suite de seguridad MG Pilot. Vehículo garantizado y revisado en Neumacar Motors.`,
        equipment: [
          "· Motor 100% Eléctrico (Etiqueta CERO Emisiones)",
          "· Cuadro de mandos digital de 7\"",
          "· Pantalla táctil multimedia de 10,25\"",
          "· Apple CarPlay y Android Auto",
          "· Faros Full LED delanteros y traseros",
          "· Paquete de asistentes de conducción MG Pilot",
          "· Sensores de aparcamiento traseros",
          "· Climatizador automático",
          "· Arranque sin llave por botón",
          "· Sistema de recuperación de energía en frenada",
          "· Volante multifunción ergonómico"
        ]
      };
    }
    if (m.includes("zs")) {
      return {
        fuel: v.includes("ev") || v.includes("electric") ? "Eléctrico" : "Gasolina",
        transmission: "Manual",
        power: 106,
        displacement: 1498,
        doors: 5,
        seats: 5,
        bodyType: "SUV",
        description: `MG ZS SUV compacto, espacioso y versátil. Excelente relación precio-equipamiento, con gran capacidad de maletero y posición de conducción elevada. Revisado minuciosamente por el equipo técnico de Neumacar Motors.`,
        equipment: [
          "· Pantalla táctil de 10,1\" con Apple CarPlay y Android Auto",
          "· Sensores de aparcamiento traseros con cámara",
          "· Llantas de aleación de 17\"",
          "· Barras de techo longitudinales",
          "· Climatizador automático",
          "· Faros LED de iluminación diurna",
          "· Volante multifunción de cuero"
        ]
      };
    }
  }

  // Caso BMW (ej. Serie 1, Serie 3, etc.)
  if (b.includes("bmw")) {
    return {
      fuel: v.includes("d") ? "Diésel" : v.includes("e") ? "Híbrido" : "Gasolina",
      transmission: v.includes("auto") || v.includes("steptronic") ? "Automático" : "Manual",
      power: 150,
      displacement: 1995,
      doors: 5,
      seats: 5,
      bodyType: m.includes("x") ? "SUV" : "Compacto",
      description: `Espectacular BMW ${model.toUpperCase()} en excelente estado de conservación. Diseño deportivo, máxima precisión de conducción y acabado de gama alta. Incluye historial de mantenimiento completo, garantía y revisión integral de 100 puntos en Neumacar Motors.`,
      equipment: [
        "· Paquete deportivo M Sport",
        "· BMW Live Cockpit Professional (Cuadro digital)",
        "· Sistema de navegación profesional",
        "· Sensores de aparcamiento delanteros y traseros",
        "· Cámara de marcha atrás",
        "· Asientos deportivos con ajuste lumbar",
        "· Llantas de aleación M de 18\"",
        "· Iluminación ambiental interior",
        "· Climatizador automático de 3 zonas",
        "· Apple CarPlay y Android Auto",
        "· Control de crucero adaptativo con función de frenado",
        "· Faros LED adaptativos"
      ]
    };
  }

  // Caso Audi
  if (b.includes("audi")) {
    return {
      fuel: v.includes("tdi") ? "Diésel" : v.includes("e-tron") ? "Eléctrico" : "Gasolina",
      transmission: "Automático",
      power: 150,
      displacement: 1968,
      doors: 5,
      seats: 5,
      bodyType: m.includes("q") ? "SUV" : "Compacto",
      description: `Audi ${model.toUpperCase()} impecable con tecnología de vanguardia y acabado refinado. Disfruta de una conducción refinada, gran eficiencia y equipamiento tecnológico completo. Garantizado por Neumacar Motors.`,
      equipment: [
        "· Audi Virtual Cockpit (Cuadro digital configurable)",
        "· Sistema de navegación MMI Navigation Plus",
        "· Sensores de aparcamiento delanteros y traseros con cámara",
        "· Faros LED con intermitentes dinámicos",
        "· Climatizador automático bizona",
        "· Llantas de aleación de 18\"",
        "· Volante deportivo multifunción de cuero",
        "· Asistente de mantenimiento de carril Audi Active Lane Assist",
        "· Apple CarPlay y Android Auto sin cables"
      ]
    };
  }

  // Caso Mercedes-Benz
  if (b.includes("mercedes")) {
    return {
      fuel: v.includes("d") || v.includes("cdi") ? "Diésel" : "Gasolina",
      transmission: "Automático",
      power: 163,
      displacement: 1950,
      doors: 5,
      seats: 5,
      bodyType: m.includes("gla") || m.includes("glc") ? "SUV" : "Sedán",
      description: `Mercedes-Benz ${model.toUpperCase()} de alta calidad y elegancia. Motor dinámico y eficiente, acabado premium e interior envolvente con sistema MBUX. Totalmente revisado y garantizado en Neumacar Motors.`,
      equipment: [
        "· Sistema multimedia MBUX con doble pantalla ancha",
        "· Paquete deportivo AMG Line exterior e interior",
        "· Faros High Performance LED",
        "· Cámara de marcha atrás y sensores Parktronic",
        "· Asientos confortables en cuero/microfibra",
        "· Climatizador automático Thermotronic",
        "· Control de crucero Tempomat con limitador de velocidad",
        "· Llantas de aleación AMG de 18\""
      ]
    };
  }

  // Fallback Genérico para cualquier otra marca y modelo
  return {
    fuel: "Gasolina",
    transmission: "Manual",
    power: 120,
    displacement: 1500,
    doors: 5,
    seats: 5,
    bodyType: "Compacto",
    description: `Excelente ${brand} ${model} de ocasión en impecable estado de conservación. Vehículo completamente revisado en nuestros talleres con garantía de calidad Neumacar Motors. Mantenimiento al día, financiación a medida disponible.`,
    equipment: [
      "· Sistema de navegación multimedia con pantalla táctil",
      "· Conectividad Apple CarPlay y Android Auto",
      "· Cámara de visión trasera y sensores de aparcamiento",
      "· Faros con iluminación LED diurna",
      "· Climatizador automático",
      "· Control de crucero y limitador de velocidad",
      "· Asistente de frenado de emergencia",
      "· Volante multifunción de cuero",
      "· Llantas de aleación de 17\"",
      "· Sistema de aviso de cambio involuntario de carril"
    ]
  };
}
