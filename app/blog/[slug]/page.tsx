import { prisma } from "@/app/lib/prisma";
import { canReact } from "@/app/lib/permissions";
import { auth } from "@/auth";
import Comments from "@/components/blog/Comments";
import LikeButton from "@/components/blog/LikeButton";
import Navbar from "@/components/home/Nav/Navbar";
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
            likes: {
                where: { userId: session?.user?.id ?? "none" },
                select: { id: true },
            },
            comments: {
                where: { parentId: null },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                            role: true,
                        },
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

    const isOwner = session?.user?.id === post.authorId;

    return (
        <div
            className="min-h-screen bg-[#F9F7F4] text-[#1A1A1A]"
            style={{ fontFamily: "'Georgia', serif" }}
        >
            <Navbar />

            <main className="mx-auto max-w-3xl px-6 py-12">
                {/* Back + Edit */}
                <div className="flex items-center justify-between mb-8">
                    <Link
                        href="/blog"
                        className="text-sm text-[#8B6F4E] hover:text-[#1A1A1A] transition-colors"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        ← Back to articles
                    </Link>
                    {isOwner && (
                        <Link
                            href={`/dashboard/edit/${post.id}`}
                            className="text-sm px-4 py-1.5 border border-[#E0DDD8] rounded-full text-[#666] hover:border-[#C4B99A] hover:text-[#1A1A1A] transition-all font-sans"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            Edit post
                        </Link>
                    )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: { id: string; name: string }) => (
                        <Link
                            key={tag.id}
                            href={`/blog?tag=${encodeURIComponent(tag.name)}`}
                            className="rounded-full bg-[#F0EDE8] px-3 py-1 text-xs text-[#8B6F4E] hover:bg-[#E8E0D5] transition-colors"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            {tag.name}
                        </Link>
                    ))}
                </div>

                {/* Title */}
                <h1
                    className="mt-5 text-4xl font-bold leading-tight md:text-5xl"
                    style={{ letterSpacing: "-0.03em" }}
                >
                    {post.title}
                </h1>

                {/* Excerpt */}
                {post.excerpt && (
                    <p
                        className="mt-4 text-lg leading-8 text-[#666]"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        {post.excerpt}
                    </p>
                )}

                {/* Author + meta */}
                <div
                    className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[#888]"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                >
                    <Link
                        href={`/profile/${post.author.id}`}
                        className="flex items-center gap-2 hover:text-[#1A1A1A] transition-colors"
                    >
                        <div className="w-7 h-7 rounded-full bg-[#D4C5B0] flex items-center justify-center text-xs font-bold text-[#8B6F4E] shrink-0">
                            {post.author.name?.[0] ?? "A"}
                        </div>
                        <span className="font-medium text-[#555]">
                            {post.author.name ?? "Author"}
                        </span>
                    </Link>
                    <span>·</span>
                    <span>
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </span>
                    <span>·</span>
                    <span>{post._count.comments} comments</span>
                </div>

                {/* Cover image */}
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

                {/* Like button */}
                <div className="mt-8">
                    <LikeButton
                        postId={post.id}
                        initialLiked={post.likes.length > 0}
                        initialCount={post._count.likes}
                        canLike={canReact(session)}
                    />
                </div>

                {/* Content */}
                <article
                    className="prose prose-neutral mt-10 max-w-none text-[#333]
                        prose-headings:font-bold prose-headings:text-[#1A1A1A]
                        prose-a:text-[#8B6F4E] prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-xl prose-img:border prose-img:border-[#E0DDD8]
                        prose-code:text-[#8B6F4E] prose-code:bg-[#F0EDE8] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                        prose-blockquote:border-l-[#8B6F4E] prose-blockquote:text-[#666]
                        prose-hr:border-[#E0DDD8]"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <div className="mt-12 border-t border-[#E0DDD8]" />

                {/* Guest prompt */}
                {!session && (
                    <div className="mt-10 rounded-2xl border border-[#E0DDD8] bg-white px-8 py-8 text-center">
                        <p
                            className="text-lg font-bold mb-2"
                            style={{ letterSpacing: "-0.02em" }}
                        >
                            Join the conversation
                        </p>
                        <p
                            className="text-sm text-[#888] mb-6 font-sans"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            Create a free account to like this article and leave
                            a comment.
                        </p>
                        <div className="flex items-center justify-center gap-3 flex-wrap">
                            <Link
                                href="/signup"
                                className="bg-[#1A1A1A] text-[#F9F7F4] px-5 py-2.5 rounded-full text-sm hover:bg-[#333] transition-colors font-sans"
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                Create account
                            </Link>
                            <Link
                                href="/signin"
                                className="border border-[#E0DDD8] text-[#666] px-5 py-2.5 rounded-full text-sm hover:border-[#C4B99A] hover:text-[#1A1A1A] transition-all font-sans"
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                Sign in
                            </Link>
                        </div>
                    </div>
                )}

                {/* Comments — logged in only */}
                {session && (
                    <Comments
                        postId={post.id}
                        postAuthorId={post.authorId}
                        initialComments={post.comments}
                        canComment={canReact(session)}
                    />
                )}
            </main>
        </div>
    );
};

export default BlogPostPage;
