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
import { Field } from "./fields";
import { contactSchema, type ContactValues } from "./schemas";
import { submitLead } from "@/services/leads";
import { SubmittedState } from "@/components/common/states";

export function ContactForm() {
  const [reference, setReference] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", phone: "", email: "", subject: "", message: "", consent: false },
  });

  const onSubmit = async (values: ContactValues) => {
    try {
      const result = await submitLead({
        type: "contacto",
        name: values.name,
        phone: values.phone,
        email: values.email,
        message: values.message,
        data: values,
      });
      setReference(result.reference);
      toast.success("Mensaje completado");
    } catch {
      toast.error("No se ha podido registrar el mensaje");
    }
  };

  if (reference) {
    return (
      <SubmittedState
        title="Mensaje registrado"
        reference={reference}
        description="Gracias por escribirnos. Para una respuesta inmediata, llámanos o escríbenos por WhatsApp."
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="surface-card space-y-4 rounded-lg p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre" htmlFor="c-name" error={errors.name}>
          <Input id="c-name" autoComplete="name" {...register("name")} />
        </Field>
        <Field label="Teléfono" htmlFor="c-phone" error={errors.phone}>
          <Input id="c-phone" type="tel" autoComplete="tel" {...register("phone")} />
        </Field>
        <Field label="Email" htmlFor="c-email" error={errors.email}>
          <Input id="c-email" type="email" autoComplete="email" {...register("email")} />
        </Field>
        <Field label="Asunto" htmlFor="c-subject" error={errors.subject}>
          <Input id="c-subject" {...register("subject")} />
        </Field>
      </div>
      <Field label="Mensaje" htmlFor="c-message" error={errors.message}>
        <Textarea id="c-message" rows={5} {...register("message")} />
      </Field>

      <div className="flex items-start gap-3">
        <Checkbox
          id="c-consent"
          checked={watch("consent")}
          onCheckedChange={(c) => setValue("consent", c === true, { shouldValidate: true })}
        />
        <label htmlFor="c-consent" className="text-sm text-muted-foreground">
          Acepto la{" "}
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

      <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="animate-spin" />}
        Enviar mensaje
      </Button>
    </form>
  );
}
