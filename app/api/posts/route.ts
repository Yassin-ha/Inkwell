import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { isAuthor } from "@/app/lib/permissions";

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAuthor(session)) {
        return NextResponse.json(
            { error: "Only authors can create posts" },
            { status: 403 },
        );
    }

    const { title, slug, excerpt, content, coverImage, published, tags } =
        await req.json();

    if (!title || !slug || !content) {
        return NextResponse.json(
            { error: "Title, slug and content are required" },
            { status: 400 },
        );
    }

    // Check slug uniqueness
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
        return NextResponse.json(
            { error: "A post with this title already exists" },
            { status: 400 },
        );
    }

    const post = await prisma.post.create({
        data: {
            title,
            slug,
            excerpt: excerpt || null,
            content,
            coverImage: coverImage || null,
            published: published ?? false,
            authorId: session.user.id,
            tags: {
                connectOrCreate: (tags as string[]).map((name: string) => ({
                    where: { name },
                    create: { name },
                })),
            },
        },
    });

    return NextResponse.json(post);
}
