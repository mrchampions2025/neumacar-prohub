export const formatPrice = (value: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);

export const formatNumber = (value: number) => new Intl.NumberFormat("es-ES").format(value);

export const formatKm = (value: number) => `${formatNumber(value)} km`;

export const formatDate = (value: string | Date) =>
  new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "long", year: "numeric" }).format(
    typeof value === "string" ? new Date(value) : value,
  );

/**
 * Orientative finance quota (French amortisation). Not a binding offer.
 */
export function monthlyQuota(amount: number, months: number, annualRate = 0.079) {
  if (amount <= 0 || months <= 0) return 0;
  const i = annualRate / 12;
  return (amount * i) / (1 - Math.pow(1 + i, -months));
}
