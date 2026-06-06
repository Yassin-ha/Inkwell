import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/signin",
    },
    providers: [],
} satisfies NextAuthConfig;
