import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const isAuth = await getToken({ req });
  const isLoginPage = pathname.startsWith("/login");

  if (isLoginPage && isAuth) {
    return NextResponse.redirect(`${req.nextUrl.origin}/`);
  }
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
