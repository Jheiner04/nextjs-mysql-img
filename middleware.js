/* eslint-disable @next/next/no-server-import-in-page */
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const jwt = request.cookies.get("myTokenName");

  if (!jwt) return NextResponse.redirect(new URL("/login", request.url));


  try {
    const { payload } = await jwtVerify(
      jwt,
      new TextEncoder().encode("secret")
    );
    // console.log({ payload });
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/panel/:path*", "/pdf/:path*", "/users/:path*"],
};
