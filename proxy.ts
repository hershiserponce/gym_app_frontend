import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicRoutes = ["/", "/login", "/register", "/signup"]

export function proxy(request: NextRequest) {
  const jwt = request.cookies.get("auth-storage")?.value
  const isPublicRoute = publicRoutes.some((route) =>
    route === "/"
      ? request.nextUrl.pathname === "/"
      : request.nextUrl.pathname.startsWith(route)
  )

  if (!isPublicRoute && !jwt) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isPublicRoute && jwt) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
