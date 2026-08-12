import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Camera, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FormSection, ConsentError } from "./fields";
import { valuationSchema, valuationStepFields, type ValuationValues } from "./schemas";
import { submitLead } from "@/services/leads";
import { SubmittedState } from "@/components/common/states";
import { StatusBadge } from "@/components/common/StatusBadge";

const STEPS = ["Vehículo", "Estado", "Equipamiento", "Fotografías", "Contacto"];

const CONDITIONS = ["Excelente", "Bueno", "Aceptable", "Necesita reparación"];
const EQUIPMENT = [
  "Navegador",
  "Cámara trasera",
  "Sensores de aparcamiento",
  "Techo solar",
  "Tapicería de cuero",
  "Faros LED",
  "Control de crucero",
  "Asientos calefactados",
  "Climatizador bizona",
  "Apple CarPlay / Android Auto",
  "Llantas de aleación",
  "Enganche de remolque",
];
const PHOTO_SLOTS = [
  "Frontal",
  "Trasera",
  "Lateral izquierdo",
  "Lateral derecho",
  "Interior",
  "Salpicadero",
  "Kilometraje",
  "Motor",
  "Neumáticos",
  "Daños",
];

export function ValuationWizard() {
  const [step, setStep] = useState(0);
  const [reference, setReference] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<ValuationValues>({
    resolver: zodResolver(valuationSchema),
    mode: "onTouched",
    defaultValues: {
      brand: "",
      model: "",
      version: "",
      year: "",
      plate: "",
      mileage: "",
      fuel: "",
      transmission: "",
      power: "",
      bodyType: "",
      conditionGeneral: "",
      conditionBody: "",
      conditionInterior: "",
      conditionMechanical: "",
      conditionTyres: "",
      maintenanceHistory: "",
      owners: "",
      itv: "",
      accidents: "",
      knownIssues: "",
      equipment: [],
      name: "",
      surname: "",
      phone: "",
      email: "",
      postalCode: "",
      consent: false,
    },
  });

  const equipment = watch("equipment");

  const next = async () => {
    const fields = valuationStepFields[step] ?? [];
    const valid = fields.length === 0 ? true : await trigger(fields);
    if (!valid) {
      toast.error("Revisa los campos marcados antes de continuar");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (values: ValuationValues) => {
    try {
      const result = await submitLead({
        type: "vender_vehiculo",
        name: `${values.name} ${values.surname}`,
        phone: values.phone,
        email: values.email,
        message: values.knownIssues,
        data: values,
      });
      setReference(result.reference);
      toast.success("Solicitud de valoración completada");
    } catch {
      toast.error("No se ha podido registrar la solicitud");
    }
  };

  const selectField = (
    name: keyof ValuationValues,
    label: string,
    options: string[],
    placeholder = "Selecciona una opción",
  ) => (
    <Field label={label} error={errors[name] as never}>
      <Select
        value={String(watch(name) ?? "")}
        onValueChange={(v) => setValue(name, v as never, { shouldValidate: true })}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );

  if (reference) {
    return (
      <div className="space-y-6">
        <SubmittedState
          title="Solicitud recibida"
          reference={reference}
          description="Nuestro equipo revisará la información de tu vehículo y contactará contigo para realizar una valoración. No emitimos valoraciones automáticas: la oferta se realiza tras revisar los datos y, si procede, inspeccionar el vehículo."
          action={
            <Button asChild variant="outline">
              <Link to="/">Volver al inicio</Link>
            </Button>
          }
        />
        <div className="surface-card rounded-lg p-6">
          <h3 className="font-display text-lg font-bold uppercase">Estados de tu solicitud</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "recibida",
              "en_revision",
              "pendiente_inspeccion",
              "oferta_realizada",
              "aceptada",
              "rechazada",
              "comprada",
            ].map((s) => (
              <StatusBadge key={s} status={s} className={s === "recibida" ? "" : "opacity-45"} />
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Podrás seguir el estado desde tu área de cliente cuando la autenticación esté activa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div>
        <div className="flex items-center justify-between text-sm">
          <p className="font-display uppercase tracking-wider text-primary">
            Paso {step + 1} de {STEPS.length}
          </p>
          <p className="text-muted-foreground">{STEPS[step]}</p>
        </div>
        <Progress value={((step + 1) / STEPS.length) * 100} className="mt-3" />
      </div>

      {step === 0 && (
        <FormSection title="Datos del vehículo">
          <Field label="Marca" htmlFor="v-brand" error={errors.brand}>
            <Input id="v-brand" placeholder="Seat" {...register("brand")} />
          </Field>
          <Field label="Modelo" htmlFor="v-model" error={errors.model}>
            <Input id="v-model" placeholder="León" {...register("model")} />
          </Field>
          <Field label="Versión" htmlFor="v-version" error={errors.version}>
            <Input id="v-version" placeholder="1.5 TSI FR 150 CV" {...register("version")} />
          </Field>
          <Field label="Año" htmlFor="v-year" error={errors.year}>
            <Input id="v-year" inputMode="numeric" placeholder="2019" {...register("year")} />
          </Field>
          <Field label="Matrícula" htmlFor="v-plate" error={errors.plate}>
            <Input id="v-plate" placeholder="1234 ABC" {...register("plate")} />
          </Field>
          <Field label="Kilómetros" htmlFor="v-mileage" error={errors.mileage}>
            <Input
              id="v-mileage"
              inputMode="numeric"
              placeholder="98000"
              {...register("mileage")}
            />
          </Field>
          {selectField("fuel", "Combustible", [
            "Gasolina",
            "Diésel",
            "Híbrido",
            "Eléctrico",
            "GLP",
          ])}
          {selectField("transmission", "Cambio", ["Manual", "Automático"])}
          <Field label="Potencia (CV)" htmlFor="v-power" error={errors.power}>
            <Input id="v-power" inputMode="numeric" placeholder="150" {...register("power")} />
          </Field>
          {selectField("bodyType", "Carrocería", [
            "Compacto",
            "Sedán",
            "Familiar",
            "SUV",
            "Monovolumen",
            "Coupé",
            "Cabrio",
            "Furgoneta",
          ])}
        </FormSection>
      )}

      {step === 1 && (
        <FormSection
          title="Estado del vehículo"
          description="Sé realista: nos permite ofrecerte un precio ajustado y sin sorpresas."
        >
          {selectField("conditionGeneral", "Estado general", CONDITIONS)}
          {selectField("conditionBody", "Carrocería", CONDITIONS)}
          {selectField("conditionInterior", "Interior", CONDITIONS)}
          {selectField("conditionMechanical", "Mecánica", CONDITIONS)}
          {selectField("conditionTyres", "Neumáticos", CONDITIONS)}
          {selectField("maintenanceHistory", "Historial de mantenimiento", [
            "Completo en oficial",
            "Completo en taller independiente",
            "Parcial",
            "Sin historial",
          ])}
          <Field label="Número de propietarios" htmlFor="v-owners" error={errors.owners}>
            <Input id="v-owners" inputMode="numeric" placeholder="1" {...register("owners")} />
          </Field>
          {selectField("itv", "ITV", ["En vigor", "Caducada", "No requiere"])}
          {selectField("accidents", "Accidentes", [
            "Nunca ha tenido",
            "Golpe leve reparado",
            "Daño importante reparado",
            "Con daños actuales",
          ])}
          <Field
            label="Averías conocidas"
            htmlFor="v-issues"
            error={errors.knownIssues}
            className="sm:col-span-2"
          >
            <Textarea
              id="v-issues"
              rows={4}
              placeholder="Indica cualquier avería o detalle relevante"
              {...register("knownIssues")}
            />
          </Field>
        </FormSection>
      )}

      {step === 2 && (
        <FormSection title="Equipamiento" description="Marca todo lo que incluya tu vehículo.">
          <div className="sm:col-span-2 grid gap-3 sm:grid-cols-2">
            {EQUIPMENT.map((item) => {
              const checked = equipment.includes(item);
              return (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-md border border-border p-3"
                >
                  <Checkbox
                    id={`eq-${item}`}
                    checked={checked}
                    onCheckedChange={(c) =>
                      setValue(
                        "equipment",
                        c === true ? [...equipment, item] : equipment.filter((e) => e !== item),
                      )
                    }
                  />
                  <Label htmlFor={`eq-${item}`} className="cursor-pointer">
                    {item}
                  </Label>
                </div>
              );
            })}
          </div>
        </FormSection>
      )}

      {step === 3 && (
        <FormSection
          title="Fotografías"
          description="La subida de imágenes se activará al conectar el almacenamiento de archivos. Mientras tanto puedes enviárnoslas por WhatsApp cuando te contactemos."
        >
          <div className="sm:col-span-2 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {PHOTO_SLOTS.map((slot) => (
              <div
                key={slot}
                className="flex aspect-square flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/30 p-2 text-center text-xs text-muted-foreground"
              >
                <Camera className="size-5" />
                {slot}
              </div>
            ))}
          </div>
        </FormSection>
      )}

      {step === 4 && (
        <>
          <FormSection title="Datos del propietario">
            <Field label="Nombre" htmlFor="v-name" error={errors.name}>
              <Input id="v-name" autoComplete="given-name" {...register("name")} />
            </Field>
            <Field label="Apellidos" htmlFor="v-surname" error={errors.surname}>
              <Input id="v-surname" autoComplete="family-name" {...register("surname")} />
            </Field>
            <Field label="Teléfono" htmlFor="v-phone" error={errors.phone}>
              <Input id="v-phone" type="tel" autoComplete="tel" {...register("phone")} />
            </Field>
            <Field label="Email" htmlFor="v-email" error={errors.email}>
              <Input id="v-email" type="email" autoComplete="email" {...register("email")} />
            </Field>
            <Field label="Código postal" htmlFor="v-cp" error={errors.postalCode}>
              <Input
                id="v-cp"
                inputMode="numeric"
                placeholder="28001"
                {...register("postalCode")}
              />
            </Field>
          </FormSection>

          <div className="flex items-start gap-3">
            <Checkbox
              id="v-consent"
              checked={watch("consent")}
              onCheckedChange={(c) => setValue("consent", c === true, { shouldValidate: true })}
            />
            <label htmlFor="v-consent" className="text-sm text-muted-foreground">
              Autorizo a Neumacar Motors a contactar conmigo y acepto la{" "}
              <Link to="/privacidad" className="text-primary underline-offset-4 hover:underline">
                política de privacidad
              </Link>
              .
              <ConsentError message={errors.consent?.message} />
            </label>
          </div>
        </>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button type="button" variant="outline" size="lg" onClick={back} disabled={step === 0}>
          <ArrowLeft /> Anterior
        </Button>
        {step < STEPS.length - 1 ? (
          <Button type="button" variant="hero" size="lg" onClick={next}>
            Continuar <ArrowRight />
          </Button>
        ) : (
          <Button type="submit" variant="hero" size="xl" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin" />}
            Solicitar valoración
          </Button>
        )}
      </div>
    </form>
  );
}
