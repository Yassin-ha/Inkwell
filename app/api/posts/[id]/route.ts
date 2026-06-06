import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

type RouteContext = {
    params: Promise<{ id: string }>;
};

// GET — fetch single post
export async function GET(
    _req: Request,
    { params }: RouteContext,
) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
        where: { id: id },
        include: { tags: true },
    });

    if (!post || post.authorId !== session.user.id) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(post);
}

// PATCH — update post 
export async function PATCH(
    req: Request,
    { params }: RouteContext,
) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({ where: { id: id } });
    if (!post || post.authorId !== session.user.id) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await req.json();
    const { title, slug, excerpt, content, coverImage, published, tags } = body;

    const tagOperations = tags
        ? {
              tags: {
                  set: [],
                  connectOrCreate: tags.map((name: string) => ({
                      where: { name },
                      create: { name },
                  })),
              },
          }
        : {};

    const updated = await prisma.post.update({
        where: { id: id },
        data: {
            ...(title !== undefined && { title }),
            ...(slug !== undefined && { slug }),
            ...(excerpt !== undefined && { excerpt }),
            ...(content !== undefined && { content }),
            ...(coverImage !== undefined && { coverImage }),
            ...(published !== undefined && { published }),
            ...tagOperations,
        },
        include: { tags: true },
    });

    return NextResponse.json(updated);
}

export async function DELETE(
    _req: Request,
    { params }: RouteContext,
) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({ where: { id: id } });
    if (!post || post.authorId !== session.user.id) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.post.delete({ where: { id: id } });

    return NextResponse.json({ success: true });
}
