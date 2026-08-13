import { z } from "zod";

export const nameSchema = z
  .string()
  .trim()
  .min(2, { message: "Introduce al menos 2 caracteres" })
  .max(80, { message: "Máximo 80 caracteres" });

export const phoneSchema = z
  .string()
  .trim()
  .min(9, { message: "Teléfono no válido" })
  .max(20, { message: "Teléfono no válido" })
  .regex(/^[+0-9\s.-]+$/, { message: "Sólo números, espacios y +" });

export const emailSchema = z
  .string()
  .trim()
  .email({ message: "Email no válido" })
  .max(255, { message: "Email demasiado largo" });

export const plateSchema = z
  .string()
  .trim()
  .min(4, { message: "Matrícula no válida" })
  .max(12, { message: "Matrícula no válida" });

export const consentSchema = z
  .boolean()
  .refine((v) => v === true, { message: "Debes aceptar para continuar" });

const notes = z.string().trim().max(1500, { message: "Texto demasiado largo" });

export const appointmentSchema = z.object({
  name: nameSchema,
  surname: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  plate: plateSchema,
  brand: z.string().trim().min(2, { message: "Indica la marca" }).max(40),
  model: z.string().trim().min(1, { message: "Indica el modelo" }).max(40),
  year: z
    .string()
    .trim()
    .regex(/^(19|20)\d{2}$/, { message: "Año no válido" }),
  mileage: z
    .string()
    .trim()
    .regex(/^\d{1,7}$/, { message: "Kilómetros no válidos" }),
  service: z.string().min(1, { message: "Selecciona un servicio" }),
  date: z.string().min(1, { message: "Selecciona una fecha" }),
  time: z.string().min(1, { message: "Selecciona una hora" }),
  notes,
  consent: consentSchema,
});
export type AppointmentValues = z.infer<typeof appointmentSchema>;

export const quoteSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  plate: z.string().trim().max(12, { message: "Matrícula no válida" }),
  brand: z.string().trim().min(2, { message: "Indica la marca" }).max(40),
  model: z.string().trim().min(1, { message: "Indica el modelo" }).max(40),
  mileage: z
    .string()
    .trim()
    .regex(/^\d{1,7}$/, { message: "Kilómetros no válidos" }),
  service: z.string().min(1, { message: "Selecciona un servicio" }),
  description: z
    .string()
    .trim()
    .min(10, { message: "Cuéntanos brevemente el problema (mín. 10 caracteres)" })
    .max(1500, { message: "Máximo 1500 caracteres" }),
  contactPreference: z.enum(["telefono", "whatsapp", "email"]),
  consent: consentSchema,
});
export type QuoteValues = z.infer<typeof quoteSchema>;

export const contactSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  subject: z.string().trim().min(3, { message: "Indica un asunto" }).max(120),
  message: z
    .string()
    .trim()
    .min(10, { message: "Escribe tu mensaje (mín. 10 caracteres)" })
    .max(1500, { message: "Máximo 1500 caracteres" }),
  consent: consentSchema,
});
export type ContactValues = z.infer<typeof contactSchema>;

export const testDriveSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  date: z.string().min(1, { message: "Selecciona una fecha" }),
  time: z.string().min(1, { message: "Selecciona una hora" }),
  notes,
  consent: consentSchema,
});
export type TestDriveValues = z.infer<typeof testDriveSchema>;

/* ---------- Valoración de vehículo (multipaso) ---------- */

export const valuationSchema = z.object({
  // Paso 1 — vehículo
  brand: z.string().trim().min(2, { message: "Indica la marca" }).max(40),
  model: z.string().trim().min(1, { message: "Indica el modelo" }).max(40),
  version: z.string().trim().max(80, { message: "Texto demasiado largo" }),
  year: z
    .string()
    .trim()
    .regex(/^(19|20)\d{2}$/, { message: "Año no válido" }),
  plate: plateSchema,
  mileage: z
    .string()
    .trim()
    .regex(/^\d{1,7}$/, { message: "Kilómetros no válidos" }),
  fuel: z.string().min(1, { message: "Selecciona el combustible" }),
  transmission: z.string().min(1, { message: "Selecciona el cambio" }),
  power: z
    .string()
    .trim()
    .regex(/^\d{1,4}$/, { message: "Potencia no válida" }),
  bodyType: z.string().min(1, { message: "Selecciona la carrocería" }),
  // Paso 2 — estado
  conditionGeneral: z.string().min(1, { message: "Selecciona una opción" }),
  conditionBody: z.string().min(1, { message: "Selecciona una opción" }),
  conditionInterior: z.string().min(1, { message: "Selecciona una opción" }),
  conditionMechanical: z.string().min(1, { message: "Selecciona una opción" }),
  conditionTyres: z.string().min(1, { message: "Selecciona una opción" }),
  maintenanceHistory: z.string().min(1, { message: "Selecciona una opción" }),
  owners: z
    .string()
    .trim()
    .regex(/^\d{1,2}$/, { message: "Indica un número" }),
  itv: z.string().min(1, { message: "Selecciona una opción" }),
  accidents: z.string().min(1, { message: "Selecciona una opción" }),
  knownIssues: notes,
  // Paso 3 — equipamiento
  equipment: z.array(z.string()),
  // Paso 4 — imágenes
  images: z.array(z.string()).optional(),
  // Paso 5 — propietario
  name: nameSchema,
  surname: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/, { message: "Código postal no válido" }),
  consent: consentSchema,
});
export type ValuationValues = z.infer<typeof valuationSchema>;

export const valuationStepFields: Array<Array<keyof ValuationValues>> = [
  [
    "brand",
    "model",
    "version",
    "year",
    "plate",
    "mileage",
    "fuel",
    "transmission",
    "power",
    "bodyType",
  ],
  [
    "conditionGeneral",
    "conditionBody",
    "conditionInterior",
    "conditionMechanical",
    "conditionTyres",
    "maintenanceHistory",
    "owners",
    "itv",
    "accidents",
    "knownIssues",
  ],
  ["equipment"],
  [],
  ["name", "surname", "phone", "email", "postalCode", "consent"],
];
