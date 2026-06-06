"use server";

import { prisma } from "@/app/lib/prisma";
import { AUTHOR_ROLE, READER_ROLE } from "@/app/lib/permissions";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

type ActionState = {
    error: string | null;
};

export async function createAccount(
    prevState: ActionState,
    data: FormData,
): Promise<ActionState> {
    const name = data.get("name") as string | null;
    const email = data.get("email") as string | null;
    const password = data.get("password") as string | null;
    const role = (data.get("role") as string) || "USER";

    if (!name || !email || !password) {
        return { error: "All fields are required" };
    }

    if (password.length < 8) {
        return { error: "Password must be at least 8 characters" };
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        return { error: "Email already in use" };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role === AUTHOR_ROLE ? AUTHOR_ROLE : READER_ROLE,
            },
        });
    } catch (error) {
        console.error("Error creating user:", error);
        return { error: "Failed to create account. Please try again." };
    }

    redirect("/signin");
}
