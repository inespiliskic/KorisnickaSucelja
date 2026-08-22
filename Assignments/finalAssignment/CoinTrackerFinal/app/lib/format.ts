export const currencyOptions = [
  { value: "EUR", label: "Euro (EUR)" },
  { value: "USD", label: "Američki dolar (USD)" },
  { value: "GBP", label: "Britanska funta (GBP)" },
  { value: "CHF", label: "Švicarski franak (CHF)" },
  { value: "BAM", label: "Konvertibilna marka (BAM)" },
];

export function euro(value: number, currency = "EUR") {
  return new Intl.NumberFormat("hr-HR", {
    style: "currency",
    currency,
  }).format(value);
}

export function prettyDate(value: string) {
  return new Intl.DateTimeFormat("hr-HR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}
