export interface LocalSeoLandingConfig {
  slug: string;
  serviceId: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  badge: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImage: string;
  priceFrom: number;
  neighborhoods: string[];
  features: Array<{ title: string; desc: string; icon: string }>;
  faqs: Array<{ q: string; a: string }>;
  keywords: string[];
}

export const LOCAL_SEO_LANDINGS: Record<string, LocalSeoLandingConfig> = {
  "taller-mecanico-sevilla": {
    slug: "taller-mecanico-sevilla",
    serviceId: "mecanica-general",
    title: "Taller Mecánico en Sevilla | NeumaCar Motors",
    metaTitle: "Taller Mecánico en Sevilla de Confianza | NeumaCar Motors",
    metaDescription: "Taller mecánico multimarca en Sevilla. Diagnóstico por ordenador, mantenimiento oficial, neumáticos, frenos y electricidad. Pide cita sin compromiso.",
    badge: "Taller Mecánico de Referencia en Sevilla",
    heroHeadline: "Tu Taller Mecánico de Confianza en Sevilla",
    heroSubheadline: "Reparación integral multimarca con diagnosis avanzada, presupuesto transparente previo y garantía oficial en Sevilla y aljarafe.",
    heroImage: "https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&q=80&w=1200",
    priceFrom: 39,
    neighborhoods: ["Sevilla Centro", "Triana", "Nervión", "Macarena", "Los Remedios", "Sevilla Este", "Pino Montano", "Bellavista"],
    features: [
      { title: "Diagnóstico Multimarca", desc: "Equipos de diagnosis de última generación para cualquier marca y modelo.", icon: "ScanSearch" },
      { title: "Presupuesto Cerrado", desc: "Sin sorpresas. Te informamos del coste exacto antes de tocar tu vehículo.", icon: "FileText" },
      { title: "Garantía de Reparación", desc: "Garantía por escrito en piezas y mano de obra siguiendo directivas europeas.", icon: "ShieldCheck" },
      { title: "Cita Rápida y Coche Sustitución", desc: "Atención prioritaria y vehículo de sustitución bajo reserva previa.", icon: "Clock" },
    ],
    faqs: [
      { q: "¿En qué zona de Sevilla se encuentra el taller?", a: "Nuestro taller principal está estratégicamente ubicado en Sevilla con excelente acceso directo desde la SE-30, Triana y Nervión." },
      { q: "¿Mantengo la garantía oficial de mi coche?", a: "Sí. Según el Reglamento Europeo 461/2010, puedes realizar el mantenimiento en nuestro taller independiente sin perder la garantía del fabricante." },
      { q: "¿Dáis presupuesto previo sin compromiso?", a: "Totalmente. Tras realizar la comprobación inicial te entregamos un presupuesto desglosado antes de realizar cualquier intervención." }
    ],
    keywords: ["Taller mecánico Sevilla", "Taller coche Sevilla", "Mecánico de confianza Sevilla", "Reparación de coches Sevilla"]
  },

  "cambio-aceite-sevilla": {
    slug: "cambio-aceite-sevilla",
    serviceId: "cambio-de-aceite",
    title: "Cambio de Aceite y Filtros en Sevilla | NeumaCar",
    metaTitle: "Cambio de Aceite en Sevilla desde 69€ | NeumaCar Motors",
    metaDescription: "Cambio de aceite y filtros en Sevilla. Aceite sintético homologado por el fabricante, filtro de aceite y reseteo de servicio. ¡Sin cita o con cita rápida!",
    badge: "Servicio Exprés de Mantenimiento en Sevilla",
    heroHeadline: "Cambio de Aceite y Filtros en Sevilla",
    heroSubheadline: "Utilizamos aceites 100% sintéticos con especificación oficial y filtros homologados para prolongar la vida útil de tu motor en Sevilla.",
    heroImage: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=1200",
    priceFrom: 69,
    neighborhoods: ["Sevilla Este", "Nervión", "Macarena", "Triana", "San Pablo", "Bami"],
    features: [
      { title: "Aceite Específico Homologado", desc: "0W20, 5W30, 5W40 según la especificación exacta de tu motor (VW, BMW, Mercedes, PSA).", icon: "Droplet" },
      { title: "Filtro de Aceite Incluido", desc: "Sustitución de filtro y arandela de cárter en cada servicio.", icon: "CheckCircle2" },
      { title: "Reseteo del Cuadro", desc: "Borrado de aviso de mantenimiento en centralita digital.", icon: "RotateCcw" },
      { title: "Revisión de 20 Puntos", desc: "Comprobación gratuita de niveles, neumáticos y líquido de frenos.", icon: "Eye" },
    ],
    faqs: [
      { q: "¿Cada cuántos kilómetros debo cambiar el aceite en Sevilla?", a: "Recomendamos cambiarlo cada 15.000 km o 1 año (lo que antes ocurra), especialmente con las altas temperaturas estivales de Sevilla." },
      { q: "¿Qué marca de aceite utilizáis?", a: "Trabajamos con primeras marcas como Castrol, Shell, Motul y Repsol siguiendo la norma de tu vehículo." }
    ],
    keywords: ["Cambio aceite Sevilla", "Cambio filtro aceite Sevilla", "Revisión aceite coche Sevilla", "Taller cambio aceite barato Sevilla"]
  },

  "embrague-sevilla": {
    slug: "embrague-sevilla",
    serviceId: "embrague",
    title: "Cambio de Embrague en Sevilla | NeumaCar Motors",
    metaTitle: "Cambio de Embrague en Sevilla con Volante Bimasa | NeumaCar",
    metaDescription: "Especialistas en cambio de embrague y volante bimasa en Sevilla. Kits Luk, Sachs y Valeo. Diagnóstico gratuito y presupuesto cerrado.",
    badge: "Especialistas en Transmisiones y Embragues",
    heroHeadline: "Cambio de Embrague y Bimasa en Sevilla",
    heroSubheadline: "Reparación y sustitución de kits de embrague, volante bimasa y cojinetes hidráulicos con la mayor garantía de Sevilla.",
    heroImage: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&q=80&w=1200",
    priceFrom: 549,
    neighborhoods: ["Sevilla Capital", "Triana", "Nervión", "Los Remedios", "Aljarafe"],
    features: [
      { title: "Kits de Primer Equipo", desc: "Montaje exclusivo de recambios originales LUK, Sachs y Valeo.", icon: "Cog" },
      { title: "Volante Bimasa", desc: "Verificación del juego tolerado y cambio de volante bimasa si procede.", icon: "Disc" },
      { title: "Sangrado Hidráulico", desc: "Renovación del líquido del bombín primario y secundario.", icon: "Wrench" },
      { title: "Prueba Dinámica", desc: "Test de rodadura para asegurar el suave acoplamiento del pedal.", icon: "Car" },
    ],
    faqs: [
      { q: "¿Cómo sé si el embrague de mi coche está patinando?", a: "Si al acelerar el motor sube de revoluciones pero el coche no gana velocidad a la par, o si las marchas entran duras, tu embrague necesita revisión." },
      { q: "¿Es obligatorio cambiar siempre el volante bimasa?", a: "No siempre, pero es altamente recomendable si presenta holgura o ruidos al arrancar para no pagar doble mano de obra a corto plazo." }
    ],
    keywords: ["Cambio embrague Sevilla", "Taller embrague Sevilla", "Precio embrague bimasa Sevilla", "Kit embrague Luk Sevilla"]
  },

  "frenos-sevilla": {
    slug: "frenos-sevilla",
    serviceId: "frenos",
    title: "Cambio de Pastillas y Discos de Freno en Sevilla",
    metaTitle: "Cambio de Frenos en Sevilla | Pastillas y Discos | NeumaCar",
    metaDescription: "Cambio de pastillas y discos de freno en Sevilla. Revisión de líquido de frenos y ABS. Componentes de alta seguridad al mejor precio.",
    badge: "Máxima Seguridad en Frenada",
    heroHeadline: "Cambio de Pastillas y Discos de Freno en Sevilla",
    heroSubheadline: "Mantén una frenada precisa y segura. Sustitución rápida de discos, pastillas y líquido de frenos en Sevilla.",
    heroImage: "https://images.unsplash.com/photo-1600792580403-015058970899?auto=format&fit=crop&q=80&w=1200",
    priceFrom: 79,
    neighborhoods: ["Sevilla Centro", "Nervión", "Triana", "Macarena", "Los Remedios"],
    features: [
      { title: "Pastillas Cerámicas y Estándar", desc: "Marcas líderes como Brembo, Ferodo, TRW y Ate.", icon: "ShieldAlert" },
      { title: "Comprobación de ABS y Sensores", desc: "Verificación de testigos de desgaste y unidades electrónicas de freno.", icon: "Activity" },
      { title: "Purga de Circuito de Freno", desc: "Sustitución de líquido DOT4 / DOT5.1 para eliminar humedad.", icon: "Droplets" },
    ],
    faqs: [
      { q: "¿Por qué chilla el freno al pisar el pedal?", a: "Puede deberse a cristalización de la pastilla por calor o a que el avisador metálico de desgaste ha llegado a su límite." }
    ],
    keywords: ["Cambio pastillas freno Sevilla", "Cambio discos freno Sevilla", "Taller de frenos Sevilla", "Precio pastillas freno Sevilla"]
  },

  "aire-acondicionado-sevilla": {
    slug: "aire-acondicionado-sevilla",
    serviceId: "aire-acondicionado",
    title: "Carga de Aire Acondicionado en Sevilla | NeumaCar",
    metaTitle: "Carga de Aire Acondicionado en Sevilla desde 59€ | NeumaCar",
    metaDescription: "Carga de gas de aire acondicionado R134a y R1234yf en Sevilla. Detección de fugas con contraste UV y tratamiento higienizante antioleadas.",
    badge: "Climatización Sin Pasar Calor en Sevilla",
    heroHeadline: "Carga de Aire Acondicionado y Climatización en Sevilla",
    heroSubheadline: "Combate el calor de Sevilla con un climatizador a pleno rendimiento. Carga de gas R134a y R1234yf con prueba de estanqueidad.",
    heroImage: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=1200",
    priceFrom: 59,
    neighborhoods: ["Sevilla Capital", "Triana", "Nervión", "Pino Montano", "Sevilla Este"],
    features: [
      { title: "Gas R134a y R1234yf", desc: "Disponemos de equipos automáticos para vehículos tradicionales y modelos modernos.", icon: "Snowflake" },
      { title: "Detección de Fugas UV", desc: "Inyección de tinte fluorescente para certificar que el circuito no tiene microporos.", icon: "Search" },
      { title: "Desinfección Antibacteriana", desc: "Eliminación de hongos y malos olores en el evaporador.", icon: "Wind" },
    ],
    faqs: [
      { q: "¿Cuánto tarda la carga de aire acondicionado?", a: "El proceso completo dura aproximadamente 45 a 60 minutos." }
    ],
    keywords: ["Carga aire acondicionado Sevilla", "Carga gas coche Sevilla", "Climatizador coche Sevilla", "Fuga aire acondicionado coche Sevilla"]
  },

  "taller-multimarca-sevilla": {
    slug: "taller-multimarca-sevilla",
    serviceId: "mecanica-general",
    title: "Taller Multimarca en Sevilla | Todas las Marcas",
    metaTitle: "Taller Multimarca en Sevilla | NeumaCar Motors",
    metaDescription: "Taller multimarca en Sevilla experto en marcas alemanas, asiáticas y europeas. Diagnosis oficial, revisiones de mantenimiento y mecánica general.",
    badge: "Especialistas Multimarca en Sevilla",
    heroHeadline: "Taller Multimarca de Referencia en Sevilla",
    heroSubheadline: "Mantenimiento y reparación experta para Audi, BMW, Mercedes, Volkswagen, Peugeot, Renault, Toyota, Seat, Ford y más.",
    heroImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200",
    priceFrom: 39,
    neighborhoods: ["Sevilla Capital", "Aljarafe", "Nervión", "Triana", "Macarena"],
    features: [
      { title: "Diagnosis Específica por Marca", desc: "Software actualizado para codificación e inspección según normas del fabricante.", icon: "Cpu" },
      { title: "Recambios Homologados", desc: "Piezas originales con garantía oficial intacta.", icon: "CheckSquare" },
      { title: "Atención Cercana y Directa", desc: "Trato personalizado con explicaciones claras sobre la avería.", icon: "Smile" },
    ],
    faqs: [
      { q: "¿Trabajáis con cualquier marca de coche?", a: "Sí, disponemos de herramientas de diagnosis y útiles de calado para todas las marcas europeas y asiáticas del mercado." }
    ],
    keywords: ["Taller multimarca Sevilla", "Taller Audi Sevilla", "Taller BMW Sevilla", "Taller Mercedes Sevilla", "Taller Volkswagen Sevilla"]
  }
};
