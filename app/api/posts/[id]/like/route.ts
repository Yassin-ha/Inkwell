import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function GET(_req: Request, { params }: RouteContext) {
    const { id } = await params;
    const session = await auth();

    const post = await prisma.post.findFirst({
        where: { id, published: true },
        select: { id: true, _count: { select: { likes: true } } },
    });

    if (!post) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const liked = session?.user?.id
        ? Boolean(
              await prisma.like.findUnique({
                  where: {
                      userId_postId: {
                          userId: session.user.id,
                          postId: id,
                      },
                  },
              }),
          )
        : false;

    return NextResponse.json({ liked, count: post._count.likes });
}

export async function POST(_req: Request, { params }: RouteContext) {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findFirst({
        where: { id, published: true },
        select: { id: true },
    });

    if (!post) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const existing = await prisma.like.findUnique({
        where: {
            userId_postId: {
                userId: session.user.id,
                postId: id,
            },
        },
    });

    if (existing) {
        await prisma.like.delete({ where: { id: existing.id } });
    } else {
        await prisma.like.create({
            data: {
                userId: session.user.id,
                postId: id,
            },
        });
    }

    const count = await prisma.like.count({ where: { postId: id } });

    return NextResponse.json({ liked: !existing, count });
}

