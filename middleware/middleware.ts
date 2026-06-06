import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const session = req.auth;
    const isLoggedIn = !!session;
    const role = session?.user?.role;

    // Protect dashboard — must be logged in AND be ADMIN
    if (pathname.startsWith("/dashboard")) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/signin", req.url));
        }
        if (role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    // Protect settings — any logged in user
    if (pathname.startsWith("/settings")) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/signin", req.url));
        }
    }
});

export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*"],
};
