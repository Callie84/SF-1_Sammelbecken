export function formatPriceEUR(value: number, locale = document.documentElement.lang || "de") {
return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(value);
}


export function formatDateShort(value: string | number | Date, locale = document.documentElement.lang || "de") {
return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(value));
}