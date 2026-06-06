import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

// GET — fetch current user's profile
export async function GET() {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true,
            website: true,
            twitter: true,
            github: true,
            role: true,
        },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
}

// PATCH — update current user's profile
export async function PATCH(req: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, bio, website, twitter, github, image } = await req.json();

    if (!name?.trim()) {
        return NextResponse.json(
            { error: "Name is required" },
            { status: 400 },
        );
    }

    const updated = await prisma.user.update({
        where: { id: session.user.id },
        data: {
            name: name.trim(),
            image: image?.trim() || null,
            bio: bio?.trim() || null,
            website: website?.trim() || null,
            twitter: twitter?.trim() || null,
            github: github?.trim() || null,
        },
        select: {
            id: true,
            name: true,
            image: true,
            bio: true,
            website: true,
            twitter: true,
            github: true,
        },
    });

    return NextResponse.json(updated);
}
