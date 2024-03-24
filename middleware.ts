import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const isAuth = await getToken({ req });
  const isLoginPage = pathname.startsWith("/login");

  if (isLoginPage) {
    if (isAuth) {
      return NextResponse.redirect(`${req.nextUrl.origin}/dashboard`);
    }
    return NextResponse.next();
  }

  if (!isAuth) {
    return NextResponse.redirect(`${req.nextUrl.origin}/login`);
  }

  if (pathname === "/") {
    return NextResponse.redirect(`${req.nextUrl.origin}/dashboard`);
  }
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
