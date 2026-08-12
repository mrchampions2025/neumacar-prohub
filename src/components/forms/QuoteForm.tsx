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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FormSection } from "./fields";
import { quoteSchema, type QuoteValues } from "./schemas";
import { serviceOptions } from "@/data/services";
import { submitLead } from "@/services/leads";
import { SubmittedState } from "@/components/common/states";

export function QuoteForm({ defaultService }: { defaultService?: string }) {
  const [reference, setReference] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<QuoteValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { name: "", phone: "", email: "", plate: "", brand: "", model: "", mileage: "", service: defaultService ?? "", description: "", contactPreference: "telefono", consent: false },
  });

  const onSubmit = async (values: QuoteValues) => {
    try {
      const result = await submitLead({
        type: "presupuesto",
        name: values.name,
        phone: values.phone,
        email: values.email,
        message: values.description,
        data: values,
      });
      setReference(result.reference);
      toast.success("Solicitud de presupuesto completada");
    } catch {
      toast.error("No se ha podido registrar la solicitud");
    }
  };

  if (reference) {
    return (
      <SubmittedState
        title="Solicitud recibida"
        reference={reference}
        description="Nuestro equipo revisará los datos de tu vehículo para preparar el presupuesto."
        action={
          <Button asChild variant="hero">
            <Link to="/servicios">Ver servicios</Link>
          </Button>
        }
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <FormSection title="Tus datos">
        <Field label="Nombre y apellidos" htmlFor="q-name" error={errors.name}>
          <Input id="q-name" autoComplete="name" {...register("name")} />
        </Field>
        <Field label="Teléfono" htmlFor="q-phone" error={errors.phone}>
          <Input id="q-phone" type="tel" autoComplete="tel" {...register("phone")} />
        </Field>
        <Field label="Email" htmlFor="q-email" error={errors.email} className="sm:col-span-2">
          <Input id="q-email" type="email" autoComplete="email" {...register("email")} />
        </Field>
      </FormSection>

      <FormSection title="Vehículo y servicio">
        <Field label="Matrícula (opcional)" htmlFor="q-plate" error={errors.plate}>
          <Input id="q-plate" placeholder="1234 ABC" {...register("plate")} />
        </Field>
        <Field label="Kilómetros" htmlFor="q-mileage" error={errors.mileage}>
          <Input id="q-mileage" inputMode="numeric" placeholder="98000" {...register("mileage")} />
        </Field>
        <Field label="Marca" htmlFor="q-brand" error={errors.brand}>
          <Input id="q-brand" {...register("brand")} />
        </Field>
        <Field label="Modelo" htmlFor="q-model" error={errors.model}>
          <Input id="q-model" {...register("model")} />
        </Field>
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
        <Field
          label="Descripción del problema"
          htmlFor="q-description"
          error={errors.description}
          className="sm:col-span-2"
        >
          <Textarea
            id="q-description"
            rows={5}
            placeholder="Cuéntanos qué le ocurre a tu vehículo, desde cuándo y en qué situaciones"
            {...register("description")}
          />
        </Field>
        <div className="sm:col-span-2 flex items-start gap-2 rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">
          <Paperclip className="mt-0.5 size-4 shrink-0" />
          <span>
            La subida de fotografías y documentos se habilitará con el almacenamiento de archivos.
          </span>
        </div>
      </FormSection>

      <FormSection title="Preferencia de contacto">
        <div className="sm:col-span-2">
          <RadioGroup
            value={watch("contactPreference")}
            onValueChange={(v) => setValue("contactPreference", v as QuoteValues["contactPreference"])}
            className="flex flex-wrap gap-4"
          >
            {[
              { v: "telefono", l: "Teléfono" },
              { v: "whatsapp", l: "WhatsApp" },
              { v: "email", l: "Email" },
            ].map((o) => (
              <div key={o.v} className="flex items-center gap-2">
                <RadioGroupItem value={o.v} id={`pref-${o.v}`} />
                <Label htmlFor={`pref-${o.v}`}>{o.l}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </FormSection>

      <div className="flex items-start gap-3">
        <Checkbox
          id="q-consent"
          checked={watch("consent")}
          onCheckedChange={(c) => setValue("consent", c === true, { shouldValidate: true })}
        />
        <label htmlFor="q-consent" className="text-sm text-muted-foreground">
          Autorizo a Neumacar Motors a contactar conmigo y acepto la{" "}
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
        Solicitar presupuesto
      </Button>
    </form>
  );
}
