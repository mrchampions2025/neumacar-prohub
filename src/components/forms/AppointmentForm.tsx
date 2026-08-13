import { useState, useEffect } from "react";
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
import { submitLead, fetchDailyAppointmentCount } from "@/services/leads";
import { SubmittedState } from "@/components/common/states";
import { CAR_BRANDS, getModelsForBrand } from "@/data/cars";

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

const MAX_DIRECT_APPOINTMENTS = 10;

export function AppointmentForm({ defaultService }: { defaultService?: string }) {
  const [reference, setReference] = useState<string | null>(null);
  const [appointmentsCount, setAppointmentsCount] = useState<number | null>(null);
  const [loadingCount, setLoadingCount] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      name: "",
      surname: "",
      phone: "",
      email: "",
      plate: "",
      brand: "",
      model: "",
      year: "",
      mileage: "",
      service: defaultService ?? "",
      date: "",
      time: "",
      notes: "",
      consent: false,
    },
  });

  const selectedDate = watch("date");

  useEffect(() => {
    async function checkAvailability() {
      if (!selectedDate) {
        setAppointmentsCount(null);
        return;
      }
      setLoadingCount(true);
      try {
        const count = await fetchDailyAppointmentCount(selectedDate);
        setAppointmentsCount(count);
        // If it's full, we clear the time so it won't fail validation
        // Wait, schema requires time, so we must set it to a special value or make schema optional.
        if (count >= MAX_DIRECT_APPOINTMENTS) {
          setValue("time", "A concretar", { shouldValidate: true });
        } else {
          setValue("time", "", { shouldValidate: true });
        }
      } catch (error) {
        console.error(error);
        setAppointmentsCount(0); // Fallback
      } finally {
        setLoadingCount(false);
      }
    }
    checkAvailability();
  }, [selectedDate, setValue]);

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
        pendingBackend={false}
        description="Hemos registrado tu solicitud de cita. En breve nos pondremos en contacto contigo."
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
  const isFull = appointmentsCount !== null && appointmentsCount >= MAX_DIRECT_APPOINTMENTS;

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
          <Select
            value={watch("brand")}
            onValueChange={(v) => {
              setValue("brand", v, { shouldValidate: true });
              setValue("model", "", { shouldValidate: true });
            }}
          >
            <SelectTrigger id="brand">
              <SelectValue placeholder="Selecciona la marca" />
            </SelectTrigger>
            <SelectContent>
              {CAR_BRANDS.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        
        <Field label="Modelo" htmlFor="model" error={errors.model}>
          {watch("brand") === "Otro" ? (
            <Input id="model" placeholder="Especifica el modelo" {...register("model")} />
          ) : (
            <Select
              value={watch("model")}
              onValueChange={(v) => setValue("model", v, { shouldValidate: true })}
              disabled={!watch("brand")}
            >
              <SelectTrigger id="model">
                <SelectValue placeholder={watch("brand") ? "Selecciona el modelo" : "Elige una marca primero"} />
              </SelectTrigger>
              <SelectContent>
                {getModelsForBrand(watch("brand")).map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
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
          <Select
            value={watch("service")}
            onValueChange={(v) => setValue("service", v, { shouldValidate: true })}
          >
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
        
        <Field
          label="Hora"
          error={errors.time}
          hint={isFull ? "Cupo lleno. Te asignaremos hora." : "Selecciona una franja."}
        >
          {loadingCount ? (
            <div className="flex h-10 w-full items-center justify-center rounded-md border border-input">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : isFull ? (
            <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
              A concretar por teléfono
            </div>
          ) : (
            <Select
              value={watch("time")}
              onValueChange={(v) => setValue("time", v, { shouldValidate: true })}
              disabled={!selectedDate}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedDate ? "Selecciona hora" : "Elige fecha primero"} />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </Field>
        
        <Field label="Comentarios" htmlFor="notes" error={errors.notes} className="sm:col-span-2">
          <Textarea
            id="notes"
            rows={4}
            placeholder="Describe el problema o el motivo de la visita"
            {...register("notes")}
          />
        </Field>
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
