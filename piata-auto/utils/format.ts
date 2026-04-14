export const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-RO", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);

export const formatNumber = (value: number) => new Intl.NumberFormat("en-RO").format(value);

export const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
