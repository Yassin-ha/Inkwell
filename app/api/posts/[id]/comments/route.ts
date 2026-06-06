import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function GET(_req: Request, { params }: RouteContext) {
    const { id } = await params;

    const post = await prisma.post.findFirst({
        where: { id, published: true },
        select: { id: true },
    });

    if (!post) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const comments = await prisma.comment.findMany({
        where: { postId: id, parentId: null },
        include: {
            user: { select: { id: true, name: true, image: true, role: true } },
            replies: {
                include: {
                    user: {
                        select: { id: true, name: true, image: true, role: true },
                    },
                },
                orderBy: { createdAt: "asc" },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ comments });
}

export async function POST(req: Request, { params }: RouteContext) {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, parentId } = await req.json();
    const trimmedContent =
        typeof content === "string" ? content.trim() : "";

    if (!trimmedContent) {
        return NextResponse.json(
            { error: "Comment cannot be empty" },
            { status: 400 },
        );
    }

    if (trimmedContent.length > 2000) {
        return NextResponse.json(
            { error: "Comment is too long" },
            { status: 400 },
        );
    }

    const post = await prisma.post.findFirst({
        where: { id, published: true },
        select: { id: true, authorId: true },
    });

    if (!post) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (parentId) {
        const parent = await prisma.comment.findFirst({
            where: { id: parentId, postId: id, parentId: null },
            select: { id: true },
        });

        if (!parent) {
            return NextResponse.json(
                { error: "Parent comment not found" },
                { status: 404 },
            );
        }
    }

    const comment = await prisma.comment.create({
        data: {
            content: trimmedContent,
            postId: id,
            userId: session.user.id,
            parentId: parentId || null,
        },
        include: {
            user: { select: { id: true, name: true, image: true, role: true } },
            replies: {
                include: {
                    user: {
                        select: { id: true, name: true, image: true, role: true },
                    },
                },
                orderBy: { createdAt: "asc" },
            },
        },
    });

    return NextResponse.json({ comment }, { status: 201 });
}

