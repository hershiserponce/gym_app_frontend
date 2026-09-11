import { useQuery } from "@tanstack/react-query"
import api from "@/src/services/api"
import { useTenantId } from "@/src/hooks/useTenantId"
import { CURRENCY_OPTIONS } from "@/src/lib/constants"

export function useCurrency() {
  const gymId = useTenantId()

  const { data } = useQuery({
    queryKey: ["settings", gymId],
    queryFn: async () => {
      const res = await api.get("/setting")
      return res.data
    },
    enabled: gymId !== null,
    staleTime: 5 * 60 * 1000,
  })

  const settings = data?.data?.attributes || data?.data || data || {}
  const currencyCode = settings.currency || "NIO"
  const currencyDef = CURRENCY_OPTIONS.find((c) => c.value === currencyCode)
  const locale = currencyDef?.locale || "es-NI"

  const formatValue = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
    }).format(value)
  }

  return { currency: currencyCode, locale, formatValue }
}
