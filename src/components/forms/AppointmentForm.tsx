import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2, Paperclip } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FormSection } from "./fields";
import { appointmentSchema, type AppointmentValues } from "./schemas";
import { serviceOptions } from "@/data/services";
import { submitLead } from "@/services/leads";
import { SubmittedState } from "@/components/common/states";

const TIME_SLOTS = [
  "09:00",
  "09:45",
  "10:30",
  "11:15",
  "12:00",
  "12:45",
  "16:00",
  "16:45",
  "17:30",
  "18:15",
];

export function AppointmentForm({ defaultService }: { defaultService?: string }) {
  const [reference, setReference] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { name: "", surname: "", phone: "", email: "", plate: "", brand: "", model: "", year: "", mileage: "", service: defaultService ?? "", date: "", time: "", notes: "", consent: false },
  });

  const onSubmit = async (values: AppointmentValues) => {
    try {
      const result = await submitLead({
        type: "cita",
        name: `${values.name} ${values.surname}`,
        phone: values.phone,
        email: values.email,
        message: values.notes,
        data: values,
      });
      setReference(result.reference);
      toast.success("Solicitud de cita completada", {
        description: "Revisa el aviso de estado en pantalla.",
      });
    } catch {
      toast.error("No se ha podido registrar la cita", {
        description: "Inténtalo de nuevo o llámanos por teléfono.",
      });
    }
  };

  if (reference) {
    return (
      <SubmittedState
        title="Cita solicitada"
        reference={reference}
        description="Hemos recogido los datos de tu cita. La sincronización con Google Calendar se activará cuando la integración esté configurada."
        action={
          <>
            <Button asChild variant="outline">
              <Link to="/">Volver al inicio</Link>
            </Button>
            <Button asChild variant="hero">
              <Link to="/servicios">Ver servicios</Link>
            </Button>
          </>
        }
      />
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <FormSection title="Datos del cliente">
        <Field label="Nombre" htmlFor="name" error={errors.name}>
          <Input id="name" autoComplete="given-name" {...register("name")} />
        </Field>
        <Field label="Apellidos" htmlFor="surname" error={errors.surname}>
          <Input id="surname" autoComplete="family-name" {...register("surname")} />
        </Field>
        <Field label="Teléfono" htmlFor="phone" error={errors.phone}>
          <Input id="phone" type="tel" autoComplete="tel" {...register("phone")} />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email}>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
        </Field>
      </FormSection>

      <FormSection title="Vehículo">
        <Field label="Matrícula" htmlFor="plate" error={errors.plate}>
          <Input id="plate" placeholder="1234 ABC" {...register("plate")} />
        </Field>
        <Field label="Marca" htmlFor="brand" error={errors.brand}>
          <Input id="brand" placeholder="Seat" {...register("brand")} />
        </Field>
        <Field label="Modelo" htmlFor="model" error={errors.model}>
          <Input id="model" placeholder="León" {...register("model")} />
        </Field>
        <Field label="Año" htmlFor="year" error={errors.year}>
          <Input id="year" inputMode="numeric" placeholder="2019" {...register("year")} />
        </Field>
        <Field label="Kilómetros" htmlFor="mileage" error={errors.mileage}>
          <Input id="mileage" inputMode="numeric" placeholder="98000" {...register("mileage")} />
        </Field>
      </FormSection>

      <FormSection title="Servicio y fecha">
        <Field label="Servicio" error={errors.service} className="sm:col-span-2">
          <Select value={watch("service")} onValueChange={(v) => setValue("service", v, { shouldValidate: true })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un servicio" />
            </SelectTrigger>
            <SelectContent>
              {serviceOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Fecha" htmlFor="date" error={errors.date}>
          <Input id="date" type="date" min={today} {...register("date")} />
        </Field>
        <Field label="Hora" error={errors.time} hint="Franjas orientativas; confirmamos disponibilidad.">
          <Select value={watch("time")} onValueChange={(v) => setValue("time", v, { shouldValidate: true })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una franja" />
            </SelectTrigger>
            <SelectContent>
              {TIME_SLOTS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Comentarios" htmlFor="notes" error={errors.notes} className="sm:col-span-2">
          <Textarea
            id="notes"
            rows={4}
            placeholder="Describe el problema o el motivo de la visita"
            {...register("notes")}
          />
        </Field>
        <div className="sm:col-span-2 flex items-start gap-2 rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">
          <Paperclip className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <span>
            Adjuntar fotografías o documentos estará disponible al activar el almacenamiento de
            archivos. De momento puedes enviarlos por WhatsApp.
          </span>
        </div>
      </FormSection>

      <div className="flex items-start gap-3">
        <Checkbox
          id="consent"
          checked={watch("consent")}
          onCheckedChange={(c) => setValue("consent", c === true, { shouldValidate: true })}
        />
        <label htmlFor="consent" className="text-sm text-muted-foreground">
          Autorizo a Neumacar Motors a contactar conmigo para gestionar esta cita y acepto la{" "}
          <Link to="/privacidad" className="text-primary underline-offset-4 hover:underline">
            política de privacidad
          </Link>
          .
          {errors.consent && (
            <span className="mt-1 block text-xs font-medium text-destructive">
              {errors.consent.message}
            </span>
          )}
        </label>
      </div>

      <Button type="submit" variant="hero" size="xl" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="animate-spin" />}
        Confirmar cita
      </Button>
    </form>
  );
}
