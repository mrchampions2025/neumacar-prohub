import { useMemo, useState } from "react";

import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { formatPrice, monthlyQuota } from "@/lib/format";

export function FinanceCalculator({ price }: { price: number }) {
  const [down, setDown] = useState(Math.round(price * 0.2));
  const [months, setMonths] = useState(84);

  const financed = Math.max(price - down, 0);
  const quota = useMemo(() => monthlyQuota(financed, months), [financed, months]);

  return (
    <div className="surface-card rounded-lg p-6">
      <h3 className="font-display text-xl font-bold uppercase">Calculadora de financiación</h3>

      <div className="mt-6 space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="entrada">Entrada</Label>
            <span className="font-semibold">{formatPrice(down)}</span>
          </div>
          <Slider
            id="entrada"
            className="mt-3"
            min={0}
            max={Math.round(price * 0.8)}
            step={250}
            value={[down]}
            onValueChange={([v]) => setDown(v ?? 0)}
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="plazo">Plazo</Label>
            <span className="font-semibold">{months} meses</span>
          </div>
          <Slider
            id="plazo"
            className="mt-3"
            min={12}
            max={120}
            step={12}
            value={[months]}
            onValueChange={([v]) => setMonths(v ?? 12)}
          />
        </div>

        <dl className="grid grid-cols-2 gap-4 border-t border-border pt-5 text-sm">
          <div>
            <dt className="text-muted-foreground">Precio</dt>
            <dd className="font-semibold">{formatPrice(price)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Importe financiado</dt>
            <dd className="font-semibold">{formatPrice(financed)}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-muted-foreground">Cuota aproximada</dt>
            <dd className="font-display text-3xl font-bold text-primary">
              {formatPrice(Math.round(quota))}
              <span className="text-base text-muted-foreground">/mes</span>
            </dd>
          </div>
        </dl>
      </div>

      <p className="mt-5 text-xs text-muted-foreground">
        * Cálculo orientativo (TIN 7,9 % de referencia), sin valor contractual. Toda operación de
        financiación queda sujeta a estudio y aprobación de la entidad financiera.
      </p>
    </div>
  );
}
