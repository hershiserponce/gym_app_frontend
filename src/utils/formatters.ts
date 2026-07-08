export function formatCurrency(value: number, currency = "MXN"): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
  }).format(value)
}

export function formatDate(value: string | Date, format: "short" | "long" | "datetime" = "short"): string {
  const date = typeof value === "string" ? new Date(value) : value
  const options: Intl.DateTimeFormatOptions =
    format === "short"
      ? { year: "numeric", month: "2-digit", day: "2-digit" }
      : format === "long"
        ? { year: "numeric", month: "long", day: "numeric" }
        : { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }

  return new Intl.DateTimeFormat("es-MX", options).format(date)
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "")
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function daysRemaining(date: string | Date): number {
  const end = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diff = end.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}
