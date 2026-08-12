import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, ConsentError } from "./fields";
import { testDriveSchema, type TestDriveValues } from "./schemas";
import { submitLead } from "@/services/leads";
import { SubmittedState } from "@/components/common/states";

interface Props {
  vehicleTitle: string;
  trigger: React.ReactNode;
  /** "prueba" solicita test drive, "reserva" reserva el vehículo, "info" pide información */
  intent: "prueba" | "reserva" | "info";
}

const COPY = {
  prueba: { title: "Solicitar prueba", cta: "Solicitar prueba" },
  reserva: { title: "Reservar vehículo", cta: "Reservar vehículo" },
  info: { title: "Solicitar información", cta: "Enviar solicitud" },
} as const;

export function TestDriveDialog({ vehicleTitle, trigger, intent }: Props) {
  const [open, setOpen] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TestDriveValues>({
    resolver: zodResolver(testDriveSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      date: "",
      time: "",
      notes: "",
      consent: false,
    },
  });

  const onSubmit = async (values: TestDriveValues) => {
    try {
      const result = await submitLead({
        type: intent === "prueba" ? "prueba_vehiculo" : "comprar_vehiculo",
        name: values.name,
        phone: values.phone,
        email: values.email,
        message: values.notes,
        data: { ...values, vehicle: vehicleTitle, intent },
      });
      setReference(result.reference);
      toast.success("Solicitud completada");
    } catch {
      toast.error("No se ha podido registrar la solicitud");
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-surface sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl uppercase">{COPY[intent].title}</DialogTitle>
          <DialogDescription>{vehicleTitle}</DialogDescription>
        </DialogHeader>

        {reference ? (
          <SubmittedState
            title="Solicitud recibida"
            reference={reference}
            description="Nuestro equipo comercial revisará tu solicitud y se pondrá en contacto contigo."
          />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <Field label="Nombre y apellidos" htmlFor="td-name" error={errors.name}>
              <Input id="td-name" autoComplete="name" {...register("name")} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Teléfono" htmlFor="td-phone" error={errors.phone}>
                <Input id="td-phone" type="tel" {...register("phone")} />
              </Field>
              <Field label="Email" htmlFor="td-email" error={errors.email}>
                <Input id="td-email" type="email" {...register("email")} />
              </Field>
              <Field label="Fecha" htmlFor="td-date" error={errors.date}>
                <Input id="td-date" type="date" min={today} {...register("date")} />
              </Field>
              <Field label="Hora" htmlFor="td-time" error={errors.time}>
                <Input id="td-time" type="time" {...register("time")} />
              </Field>
            </div>
            <Field label="Comentarios" htmlFor="td-notes" error={errors.notes}>
              <Textarea id="td-notes" rows={3} {...register("notes")} />
            </Field>

            <div className="flex items-start gap-3">
              <Checkbox
                id="td-consent"
                checked={watch("consent")}
                onCheckedChange={(c) => setValue("consent", c === true, { shouldValidate: true })}
              />
              <label htmlFor="td-consent" className="text-sm text-muted-foreground">
                Acepto la{" "}
                <Link to="/privacidad" className="text-primary underline-offset-4 hover:underline">
                  política de privacidad
                </Link>
                .
                <ConsentError message={errors.consent?.message} />
              </label>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="animate-spin" />}
              {COPY[intent].cta}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
