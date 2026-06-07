import { prisma } from "@/app/lib/prisma";
import { canReact } from "@/app/lib/permissions";
import { auth } from "@/auth";
import Comments from "@/components/blog/Comments";
import LikeButton from "@/components/blog/LikeButton";
import Navbar from "@/components/home/Nav/Navbar";
import type { Tag } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
    params: Promise<{ slug: string }>;
};

const BlogPostPage = async ({ params }: PageProps) => {
    const { slug } = await params;
    const session = await auth();

    const post = await prisma.post.findUnique({
        where: { slug },
        include: {
            author: { select: { id: true, name: true, image: true } },
            tags: true,
            likes: session?.user?.id
                ? {
                      where: { userId: session.user.id },
                      select: { id: true },
                  }
                : false,
            comments: {
                where: { parentId: null },
                include: {
                    user: {
                        select: { id: true, name: true, image: true, role: true },
                    },
                    replies: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    image: true,
                                    role: true,
                                },
                            },
                        },
                        orderBy: { createdAt: "asc" },
                    },
                },
                orderBy: { createdAt: "desc" },
            },
            _count: { select: { likes: true, comments: true } },
        },
    });

    if (!post || !post.published) {
        notFound();
    }

    return (
        <div
            className="min-h-screen bg-[#F9F7F4] text-[#1A1A1A]"
            style={{ fontFamily: "'Georgia', serif" }}
        >
            <Navbar />

            <main className="mx-auto max-w-3xl px-6 py-12">
                <Link
                    href="/blog"
                    className="text-sm text-[#8B6F4E] hover:text-[#1A1A1A]"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                >
                    Back to articles
                </Link>

                <div className="mt-8 flex flex-wrap gap-2">
                    {post.tags.map((tag: Tag) => (
                        <Link
                            key={tag.id}
                            href={`/blog?tag=${encodeURIComponent(tag.name)}`}
                            className="rounded-full bg-[#F0EDE8] px-3 py-1 text-xs text-[#8B6F4E]"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            {tag.name}
                        </Link>
                    ))}
                </div>

                <h1
                    className="mt-5 text-4xl font-bold leading-tight md:text-5xl"
                    style={{ letterSpacing: "-0.03em" }}
                >
                    {post.title}
                </h1>

                {post.excerpt && (
                    <p
                        className="mt-4 text-lg leading-8 text-[#666]"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        {post.excerpt}
                    </p>
                )}

                <div
                    className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[#888]"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                >
                    <span className="font-medium text-[#555]">
                        {post.author.name ?? "Author"}
                    </span>
                    <span>|</span>
                    <span>
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </span>
                    <span>|</span>
                    <span>{post._count.comments} comments</span>
                </div>

                {post.coverImage && (
                    <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-xl border border-[#E0DDD8]">
                        <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            priority
                            className="object-cover"
                        />
                    </div>
                )}

                <div className="mt-8">
                    <LikeButton
                        postId={post.id}
                        initialLiked={post.likes?.length > 0}
                        initialCount={post._count.likes}
                        canLike={canReact(session)}
                    />
                </div>

                <article
                    className="prose prose-neutral mt-10 max-w-none text-[#333]"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <Comments
                    postId={post.id}
                    postAuthorId={post.authorId}
                    initialComments={post.comments}
                    canComment={canReact(session)}
                />
            </main>
        </div>
    );
};

export default BlogPostPage;
