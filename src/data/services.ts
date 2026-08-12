/**
 * Catálogo de servicios.
 * DATOS DE DEMOSTRACIÓN — sustituir por la tabla `services` de Lovable Cloud
 * (campos: id, name, slug, category, description, price_from, duration, image, active).
 */
export interface ServiceFaq {
  q: string;
  a: string;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  category: "Mecánica" | "Neumáticos" | "Diagnóstico" | "Mantenimiento" | "Confort" | "Inspección";
  icon: string;
  short: string;
  description: string;
  includes: string[];
  when: string[];
  priceFrom: number | null;
  duration: string;
  active: boolean;
  faqs: ServiceFaq[];
  featured?: boolean;
}

export const services: Service[] = [
  {
    id: "s1",
    slug: "mecanica-general",
    name: "Mecánica general",
    category: "Mecánica",
    icon: "Wrench",
    short: "Reparación integral de tu vehículo con diagnóstico previo y presupuesto cerrado.",
    description:
      "Reparamos motor, transmisión, refrigeración, escape y todos los sistemas mecánicos del vehículo. Siempre con diagnóstico previo y presupuesto aprobado antes de intervenir.",
    includes: [
      "Diagnóstico inicial",
      "Presupuesto detallado",
      "Recambios de calidad",
      "Prueba en carretera",
    ],
    when: [
      "Ruidos o vibraciones anómalas",
      "Pérdida de potencia",
      "Fugas de líquidos",
      "Testigos encendidos",
    ],
    priceFrom: 45,
    duration: "Según intervención",
    active: true,
    featured: true,
    faqs: [
      {
        q: "¿El presupuesto es sin compromiso?",
        a: "Sí. Elaboramos el presupuesto tras el diagnóstico y no intervenimos hasta que lo autorizas.",
      },
      {
        q: "¿Usáis recambios originales?",
        a: "Trabajamos con recambio original y equivalente homologado. Te indicamos la opción en el presupuesto.",
      },
    ],
  },
  {
    id: "s2",
    slug: "neumaticos",
    name: "Neumáticos",
    category: "Neumáticos",
    icon: "CircleDot",
    short: "Venta y montaje de neumáticos de todas las marcas, con equilibrado y alineación.",
    description:
      "Trabajamos las principales marcas de neumáticos para turismo, SUV, 4x4 y furgoneta, en versiones de verano, invierno y all season. Montaje, equilibrado, válvulas y reciclaje incluidos.",
    includes: [
      "Montaje y desmontaje",
      "Equilibrado electrónico",
      "Válvula nueva",
      "Gestión de residuos",
    ],
    when: [
      "Profundidad inferior a 3 mm",
      "Desgaste irregular",
      "Más de 5 años de antigüedad",
      "Deformaciones o cortes",
    ],
    priceFrom: 35,
    duration: "45 min",
    active: true,
    featured: true,
    faqs: [
      {
        q: "¿Cada cuánto debo cambiar los neumáticos?",
        a: "El límite legal es 1,6 mm, pero recomendamos sustituirlos a partir de 3 mm para mantener la frenada en mojado.",
      },
      {
        q: "¿Incluye alineación?",
        a: "La alineación se presupuesta aparte; te avisamos si el desgaste indica que es necesaria.",
      },
    ],
  },
  {
    id: "s3",
    slug: "frenos",
    name: "Frenos",
    category: "Mecánica",
    icon: "Disc3",
    short: "Pastillas, discos, líquido y revisión completa del sistema de frenado.",
    description:
      "Revisamos y sustituimos pastillas, discos, tambores, latiguillos y líquido de frenos, comprobando el reparto de frenada y el estado del ABS.",
    includes: [
      "Medición de discos y pastillas",
      "Purga de circuito",
      "Comprobación de ABS",
      "Prueba dinámica",
    ],
    when: [
      "Chirridos al frenar",
      "Pedal esponjoso",
      "Vibración al frenar",
      "Mayor distancia de frenado",
    ],
    priceFrom: 79,
    duration: "1 h 30 min",
    active: true,
    featured: true,
    faqs: [
      {
        q: "¿Cada cuánto se cambia el líquido de frenos?",
        a: "Cada 2 años o 40.000 km, ya que absorbe humedad y pierde eficacia.",
      },
    ],
  },
  {
    id: "s4",
    slug: "cambio-de-aceite",
    name: "Cambio de aceite y filtros",
    category: "Mantenimiento",
    icon: "Droplets",
    short: "Aceite homologado según fabricante y sustitución de filtros.",
    description:
      "Sustituimos el aceite con la especificación exacta que exige tu fabricante y renovamos los filtros necesarios, con reseteo del intervalo de servicio.",
    includes: [
      "Aceite según especificación",
      "Filtro de aceite",
      "Reseteo del mantenimiento",
      "Revisión de niveles",
    ],
    when: [
      "Al alcanzar el intervalo del fabricante",
      "Al menos una vez al año",
      "Antes de un viaje largo",
    ],
    priceFrom: 69,
    duration: "45 min",
    active: true,
    featured: true,
    faqs: [
      {
        q: "¿Qué filtros se incluyen?",
        a: "El filtro de aceite está incluido. Aire, habitáculo y combustible se presupuestan según necesidad.",
      },
    ],
  },
  {
    id: "s5",
    slug: "distribucion",
    name: "Distribución",
    category: "Mecánica",
    icon: "Cog",
    short: "Kit de distribución y bomba de agua siguiendo el plan del fabricante.",
    description:
      "Sustitución de correa o cadena de distribución, tensores, rodillos y bomba de agua. Una intervención crítica: su rotura puede destruir el motor.",
    includes: [
      "Kit completo de distribución",
      "Bomba de agua",
      "Refrigerante nuevo",
      "Puesta a punto",
    ],
    when: [
      "Al llegar al km indicado por el fabricante",
      "Ruidos en la zona de la correa",
      "Sin historial de cambio",
    ],
    priceFrom: 349,
    duration: "4 – 6 h",
    active: true,
    faqs: [
      {
        q: "¿Cuándo toca cambiarla?",
        a: "Depende del modelo: entre 60.000 y 160.000 km o 5-10 años. Lo verificamos con la matrícula.",
      },
    ],
  },
  {
    id: "s6",
    slug: "embrague",
    name: "Embrague",
    category: "Mecánica",
    icon: "Gauge",
    short: "Kit de embrague, volante bimasa y bombines.",
    description:
      "Diagnóstico y sustitución completa del kit de embrague, incluyendo disco, maza, cojinete, y volante bimasa cuando procede.",
    includes: [
      "Kit de embrague",
      "Revisión de volante motor",
      "Sangrado hidráulico",
      "Prueba en carretera",
    ],
    when: [
      "El embrague patina",
      "Ruidos al pisar",
      "Recorrido del pedal alterado",
      "Dificultad al meter marchas",
    ],
    priceFrom: 549,
    duration: "5 – 8 h",
    active: true,
    faqs: [
      {
        q: "¿Se puede reparar sin cambiar el kit?",
        a: "En la mayoría de casos no: se sustituye el conjunto para garantizar durabilidad.",
      },
    ],
  },
  {
    id: "s7",
    slug: "suspension",
    name: "Suspensión y dirección",
    category: "Mecánica",
    icon: "Waves",
    short: "Amortiguadores, silentblocks, rótulas y alineación de dirección.",
    description:
      "Revisamos y sustituimos amortiguadores, muelles, bieletas, rótulas y brazos, con alineación de dirección posterior.",
    includes: [
      "Diagnóstico en elevador",
      "Sustitución de componentes",
      "Alineación de dirección",
      "Prueba dinámica",
    ],
    when: [
      "Rebote excesivo",
      "Ruidos en baches",
      "Desgaste irregular de neumáticos",
      "El coche se va de línea",
    ],
    priceFrom: 129,
    duration: "2 – 4 h",
    active: true,
    faqs: [
      {
        q: "¿Se cambian por parejas?",
        a: "Sí, recomendamos sustituir los amortiguadores por eje para mantener el equilibrio.",
      },
    ],
  },
  {
    id: "s8",
    slug: "diagnostico",
    name: "Diagnóstico electrónico",
    category: "Diagnóstico",
    icon: "ScanSearch",
    short: "Lectura de centralitas, análisis de averías y borrado de fallos.",
    description:
      "Conectamos equipos de diagnosis multimarca para leer todas las centralitas, analizar parámetros en vivo y localizar el origen real de la avería, no solo el síntoma.",
    includes: [
      "Lectura de todas las unidades",
      "Parámetros en tiempo real",
      "Informe de averías",
      "Plan de reparación",
    ],
    when: [
      "Testigo de motor encendido",
      "Fallos intermitentes",
      "Antes de comprar un coche usado",
      "Consumo anormal",
    ],
    priceFrom: 39,
    duration: "1 h",
    active: true,
    featured: true,
    faqs: [
      {
        q: "¿Se descuenta del arreglo?",
        a: "Sí, si autorizas la reparación en nuestro taller descontamos el importe de la diagnosis.",
      },
    ],
  },
  {
    id: "s9",
    slug: "aire-acondicionado",
    name: "Aire acondicionado",
    category: "Confort",
    icon: "Snowflake",
    short: "Carga de gas, detección de fugas y desinfección del circuito.",
    description:
      "Mantenimiento completo del climatizador: comprobación de presiones, carga de gas R134a o R1234yf, detección de fugas y limpieza del sistema.",
    includes: [
      "Comprobación de presiones",
      "Carga de gas",
      "Detección de fugas",
      "Filtro de habitáculo",
    ],
    when: ["Enfría menos que antes", "Malos olores al arrancar", "Cada 2 años de mantenimiento"],
    priceFrom: 59,
    duration: "1 h",
    active: true,
    faqs: [{ q: "¿Qué gas usáis?", a: "Trabajamos con R134a y R1234yf según el vehículo." }],
  },
  {
    id: "s10",
    slug: "electricidad",
    name: "Electricidad y baterías",
    category: "Diagnóstico",
    icon: "BatteryCharging",
    short: "Alternador, motor de arranque, cableado y sustitución de baterías.",
    description:
      "Localizamos averías eléctricas, medimos consumos parásitos y sustituimos baterías con codificación cuando el vehículo lo requiere.",
    includes: [
      "Test de batería y carga",
      "Medición de consumos",
      "Reparación de cableado",
      "Codificación de batería",
    ],
    when: [
      "El coche no arranca",
      "Batería que se descarga",
      "Luces que fallan",
      "Errores eléctricos aleatorios",
    ],
    priceFrom: 39,
    duration: "1 – 3 h",
    active: true,
    faqs: [
      {
        q: "¿Cuánto dura una batería?",
        a: "Entre 4 y 6 años según uso. Te hacemos el test de carga gratuito.",
      },
    ],
  },
  {
    id: "s11",
    slug: "pre-itv",
    name: "Pre-ITV",
    category: "Inspección",
    icon: "ClipboardCheck",
    short: "Revisamos los puntos de la ITV antes de que pases la inspección.",
    description:
      "Comprobamos luces, frenos, emisiones, holguras, neumáticos y suspensión replicando los criterios de la ITV para que no te lleves sorpresas.",
    includes: ["Checklist completo", "Informe de puntos a corregir", "Presupuesto de correcciones"],
    when: [
      "Antes de pasar la ITV",
      "Si has tenido un desfavorable",
      "Tras una reparación importante",
    ],
    priceFrom: 29,
    duration: "45 min",
    active: true,
    featured: true,
    faqs: [
      {
        q: "¿Gestionáis la ITV?",
        a: "Podemos preparar el vehículo y orientarte en la gestión de la cita de inspección.",
      },
    ],
  },
  {
    id: "s12",
    slug: "itv",
    name: "ITV",
    category: "Inspección",
    icon: "BadgeCheck",
    short: "Preparación y acompañamiento en la inspección técnica.",
    description:
      "Preparamos tu vehículo para la inspección técnica y corregimos los defectos detectados en la pre-ITV.",
    includes: ["Revisión previa", "Corrección de defectos", "Segunda comprobación"],
    when: ["Cuando caduca tu ITV", "Tras un desfavorable"],
    priceFrom: null,
    duration: "Según caso",
    active: true,
    faqs: [
      {
        q: "¿Cada cuánto toca la ITV?",
        a: "Depende de la antigüedad y tipo de vehículo. Verificamos tu caso con la matrícula.",
      },
    ],
  },
  {
    id: "s13",
    slug: "escape",
    name: "Escape y catalizador",
    category: "Mecánica",
    icon: "Wind",
    short: "Silenciadores, catalizadores, sondas lambda y filtros de partículas.",
    description:
      "Reparamos y sustituimos la línea de escape completa, incluyendo catalizador, FAP/DPF y sondas lambda, con limpieza de filtro de partículas.",
    includes: ["Diagnóstico de emisiones", "Soldadura y sustitución", "Limpieza de FAP/DPF"],
    when: ["Ruido excesivo", "Olor a gases", "Testigo de FAP", "Emisiones altas en ITV"],
    priceFrom: 89,
    duration: "1 – 4 h",
    active: true,
    faqs: [
      {
        q: "¿Se puede limpiar el FAP sin cambiarlo?",
        a: "En muchos casos sí, mediante limpieza forzada o químicos específicos.",
      },
    ],
  },
  {
    id: "s14",
    slug: "inyeccion",
    name: "Inyección y AdBlue",
    category: "Diagnóstico",
    icon: "Fuel",
    short: "Inyectores, bomba de alta y sistemas AdBlue/SCR.",
    description:
      "Diagnóstico y reparación del sistema de inyección diésel y gasolina, y de los sistemas de reducción catalítica AdBlue.",
    includes: ["Test de inyectores", "Comprobación de presiones", "Diagnosis SCR/AdBlue"],
    when: ["Arranque difícil", "Humo excesivo", "Testigo AdBlue", "Tirones en aceleración"],
    priceFrom: 59,
    duration: "1 – 5 h",
    active: true,
    faqs: [
      { q: "¿Rellenáis AdBlue?", a: "Sí, y comprobamos el sistema si hay avisos en el cuadro." },
    ],
  },
  {
    id: "s15",
    slug: "mantenimiento",
    name: "Mantenimiento programado",
    category: "Mantenimiento",
    icon: "CalendarCheck",
    short: "Revisiones oficiales sin perder la garantía del fabricante.",
    description:
      "Realizamos el mantenimiento según el plan del fabricante, sellando el libro de mantenimiento y conservando la garantía del vehículo.",
    includes: [
      "Plan del fabricante",
      "Sellado del libro",
      "Informe de estado",
      "Presupuesto de extras",
    ],
    when: ["Cada intervalo de km o tiempo", "Antes de un viaje", "Al comprar un coche usado"],
    priceFrom: 119,
    duration: "2 h",
    active: true,
    featured: true,
    faqs: [
      {
        q: "¿Pierdo la garantía si no voy al oficial?",
        a: "No. La normativa europea permite mantener la garantía en talleres independientes que respeten el plan del fabricante.",
      },
    ],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const featuredServices = () => services.filter((s) => s.featured);
export const serviceOptions = services
  .filter((s) => s.active)
  .map((s) => ({ value: s.slug, label: s.name }));
