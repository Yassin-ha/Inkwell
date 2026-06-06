import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
        where: { authorId: session.user.id },
        include: { tags: true },
        orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(posts);
}
