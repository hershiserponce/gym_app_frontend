import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { ReactNode } from "react"

type StatsCardProps = {
  title: string
  value: string
  icon: ReactNode
  description?: string
  isLoading?: boolean
  tone?: "blue" | "teal" | "coral" | "violet"
}

const toneStyles = {
  blue: "bg-blue-50 text-blue-600",
  teal: "bg-teal-50 text-teal-600",
  coral: "bg-orange-50 text-orange-600",
  violet: "bg-violet-50 text-violet-600",
}

export function StatsCard({
  title,
  value,
  icon,
  description,
  isLoading,
  tone = "blue",
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <span className={`rounded-lg p-2 ${toneStyles[tone]}`}>
          {icon}
        </span>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
