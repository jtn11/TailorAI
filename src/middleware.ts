import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const session = req.cookies.get("session")?.value;
  const pathname = req.nextUrl.pathname;

  if ((session && pathname === "/signin") || pathname === "/signup") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!session && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup"],
};
