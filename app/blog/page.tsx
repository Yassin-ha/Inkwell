import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/home/Nav/Navbar";
import { Tag } from "@/types/types";

const BlogPage = async ({
    searchParams,
}: {
    searchParams: { tag?: string; page?: string };
}) => {
    const session = await auth();
    const { tag, page } = await searchParams
    const currentTag = tag || "all";
    const currentPage = Number(page) || 1;
    const perPage = 9;

    // Fetch all unique tags
    const tags = await prisma.tag.findMany({
        where: { posts: { some: { published: true } } },
        orderBy: { name: "asc" },
    });

    // Fetch posts with filter
    const where = {
        published: true,
        ...(currentTag !== "all" && {
            tags: { some: { name: currentTag } },
        }),
    };

    const [posts, total] = await Promise.all([
        prisma.post.findMany({
            where,
            include: {
                author: { select: { id: true, name: true, image: true } },
                tags: true,
                _count: { select: { likes: true, comments: true } },
            },
            orderBy: { createdAt: "desc" },
            skip: (currentPage - 1) * perPage,
            take: perPage,
        }),
        prisma.post.count({ where }),
    ]);

    const totalPages = Math.ceil(total / perPage);
    type BlogPost = (typeof posts)[number];

    return (
        <div
            className="min-h-screen bg-[#F9F7F4] text-[#1A1A1A]"
            style={{ fontFamily: "'Georgia', serif" }}
        >
            <Navbar />

            {/* Page header */}
            <header className="border-b border-[#E0DDD8] py-12 px-6">
                <div className="mx-auto max-w-6xl">
                    <h1
                        className="text-4xl font-bold mb-2"
                        style={{ letterSpacing: "-0.03em" }}
                    >
                        Articles
                    </h1>
                    <p
                        className="text-[#888] text-base font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        {total} {total === 1 ? "article" : "articles"} published
                    </p>
                </div>
            </header>

            {/* Tag filter */}
            <div className="border-b border-[#E0DDD8] px-6 py-4 sticky top-16.25 bg-[#F9F7F4]/90 backdrop-blur-sm z-40">
                <div className="mx-auto max-w-6xl flex items-center gap-2 overflow-x-auto scrollbar-hide">
                    <Link
                        href="/blog"
                        className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-colors font-sans ${
                            currentTag === "all"
                                ? "bg-[#1A1A1A] text-[#F9F7F4]"
                                : "bg-[#EDEAE5] text-[#666] hover:bg-[#E0DDD8]"
                        }`}
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        All
                    </Link>
                    {tags.map((tag: Tag) => (
                        <Link
                            key={tag.id}
                            href={`/blog?tag=${tag.name}`}
                            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-colors font-sans ${
                                currentTag === tag.name
                                    ? "bg-[#1A1A1A] text-[#F9F7F4]"
                                    : "bg-[#EDEAE5] text-[#666] hover:bg-[#E0DDD8]"
                            }`}
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            {tag.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Posts grid */}
            <main className="mx-auto max-w-6xl px-6 py-12">
                {posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <p
                            className="text-[#888] font-sans"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            No articles found
                            {currentTag !== "all" ? ` for "${currentTag}"` : ""}
                            .
                        </p>
                        {currentTag !== "all" && (
                            <Link
                                href="/blog"
                                className="text-sm text-[#8B6F4E] underline font-sans"
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                View all articles
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post: BlogPost, i: number) => (
                            <article
                                key={post.id}
                                className={`group ${i === 0 && currentPage === 1 ? "md:col-span-2 lg:col-span-3" : ""}`}
                            >
                                <Link href={`/blog/${post.slug}`}>
                                    <div
                                        className={`bg-white border border-[#E0DDD8] rounded-2xl overflow-hidden hover:border-[#C4B99A] hover:shadow-md transition-all duration-200 ${
                                            i === 0 && currentPage === 1
                                                ? "flex flex-col md:flex-row"
                                                : "flex flex-col"
                                        }`}
                                    >
                                        {/* Cover image */}
                                        {post.coverImage && (
                                            <div
                                                className={`relative shrink-0 ${
                                                    i === 0 && currentPage === 1
                                                        ? "w-full md:w-1/2 h-60 md:h-auto"
                                                        : "w-full h-44"
                                                }`}
                                            >
                                                <Image
                                                    src={post.coverImage}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}

                                        {/* Content */}
                                        <div className="p-6 flex flex-col flex-1">
                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-1.5 mb-3">
                                                {post.tags
                                                    .slice(0, 2)
                                                    .map((tag: Tag) => (
                                                        <span
                                                            key={tag.id}
                                                            className="text-xs px-2.5 py-0.5 rounded-full bg-[#F0EDE8] text-[#8B6F4E] font-sans"
                                                            style={{
                                                                fontFamily:
                                                                    "system-ui, sans-serif",
                                                            }}
                                                        >
                                                            {tag.name}
                                                        </span>
                                                    ))}
                                            </div>

                                            {/* Title */}
                                            <h2
                                                className={`font-bold text-[#1A1A1A] group-hover:text-[#8B6F4E] transition-colors leading-snug mb-2 ${
                                                    i === 0 && currentPage === 1
                                                        ? "text-2xl"
                                                        : "text-lg"
                                                }`}
                                                style={{
                                                    letterSpacing: "-0.02em",
                                                }}
                                            >
                                                {post.title}
                                            </h2>

                                            {/* Excerpt */}
                                            {post.excerpt && (
                                                <p
                                                    className="text-[#666] text-sm leading-relaxed mb-4 line-clamp-2 font-sans flex-1"
                                                    style={{
                                                        fontFamily:
                                                            "system-ui, sans-serif",
                                                    }}
                                                >
                                                    {post.excerpt}
                                                </p>
                                            )}

                                            {/* Author + stats */}
                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#F0EDE8]">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-[#D4C5B0] flex items-center justify-center text-xs font-bold text-[#8B6F4E] shrink-0">
                                                        {post.author
                                                            .name?.[0] ?? "A"}
                                                    </div>
                                                    <div
                                                        className="text-xs text-[#888] font-sans"
                                                        style={{
                                                            fontFamily:
                                                                "system-ui, sans-serif",
                                                        }}
                                                    >
                                                        <span className="text-[#555] font-medium">
                                                            {post.author.name}
                                                        </span>
                                                        <span className="mx-1.5">
                                                            ·
                                                        </span>
                                                        <span>
                                                            {new Date(
                                                                post.createdAt,
                                                            ).toLocaleDateString(
                                                                "en-US",
                                                                {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    year: "numeric",
                                                                },
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Likes + comments count */}
                                                <div
                                                    className="flex items-center gap-3 text-xs text-[#999] font-sans"
                                                    style={{
                                                        fontFamily:
                                                            "system-ui, sans-serif",
                                                    }}
                                                >
                                                    <span className="flex items-center gap-1">
                                                        ♥ {post._count.likes}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        ◎ {post._count.comments}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                        {currentPage > 1 && (
                            <Link
                                href={`/blog?${currentTag !== "all" ? `tag=${currentTag}&` : ""}page=${currentPage - 1}`}
                                className="px-4 py-2 text-sm border border-[#E0DDD8] rounded-full text-[#666] hover:border-[#C4B99A] hover:text-[#1A1A1A] transition-all font-sans"
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                ← Previous
                            </Link>
                        )}

                        {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1,
                        ).map((page: number) => (
                            <Link
                                key={page}
                                href={`/blog?${currentTag !== "all" ? `tag=${currentTag}&` : ""}page=${page}`}
                                className={`w-9 h-9 flex items-center justify-center text-sm rounded-full transition-all font-sans ${
                                    page === currentPage
                                        ? "bg-[#1A1A1A] text-[#F9F7F4]"
                                        : "border border-[#E0DDD8] text-[#666] hover:border-[#C4B99A]"
                                }`}
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                {page}
                            </Link>
                        ))}

                        {currentPage < totalPages && (
                            <Link
                                href={`/blog?${currentTag !== "all" ? `tag=${currentTag}&` : ""}page=${currentPage + 1}`}
                                className="px-4 py-2 text-sm border border-[#E0DDD8] rounded-full text-[#666] hover:border-[#C4B99A] hover:text-[#1A1A1A] transition-all font-sans"
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                Next →
                            </Link>
                        )}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-[#E0DDD8] px-6 py-8">
                <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <Link
                        href="/"
                        className="text-lg font-bold"
                        style={{ letterSpacing: "-0.02em" }}
                    >
                        ✦ Inkwell
                    </Link>
                    <p
                        className="text-sm text-[#999] font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        © {new Date().getFullYear()} Inkwell. Built with Next.js
                        & love.
                    </p>
                    {!session && (
                        <Link
                            href="/signup"
                            className="text-sm bg-[#1A1A1A] text-[#F9F7F4] px-4 py-2 rounded-full hover:bg-[#333] transition-colors font-sans"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            Start writing →
                        </Link>
                    )}
                </div>
            </footer>
        </div>
    );
};

export default BlogPage;
