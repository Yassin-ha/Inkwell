import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export const proxy = auth((req) => {
    const isLoggedIn = !!req.auth;
    const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");

    if (isDashboard && !isLoggedIn) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }
});

export const config = {
    matcher: ["/dashboard/:path*"],
};
