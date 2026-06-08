import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/home/Nav/Navbar";
import { Tag } from "@/types/types";

type PageProps = {
    params: Promise<{ id: string }>;
};

const ProfilePage = async ({ params }: PageProps) => {
    const { id } = await params;
    const session = await auth();

    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            posts: {
                where: { published: true },
                include: {
                    tags: true,
                    _count: { select: { likes: true, comments: true } },
                },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!user) {
        notFound();
    }

    const isOwner = session?.user?.id === user.id;
    const isAuthor = user.role === "ADMIN";
    const totalLikesReceived = user.posts.reduce(
        (acc: number, post: (typeof user.posts)[number]) =>
            acc + post._count.likes,
        0,
    );
    type ProfilePost = (typeof user.posts)[number];

    return (
        <div
            className="min-h-screen bg-[#F9F7F4] text-[#1A1A1A]"
            style={{ fontFamily: "'Georgia', serif" }}
        >
            <Navbar />

            <main className="mx-auto max-w-4xl px-6 py-12">
                <div className="mb-10 flex flex-col items-start gap-8 border-b border-[#E0DDD8] pb-10 md:flex-row">
                    <div className="shrink-0">
                        {user.image ? (
                            <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-[#E0DDD8]">
                                <Image
                                    src={user.image}
                                    alt={user.name ?? "Profile picture"}
                                    fill
                                    sizes="96px"
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#E0DDD8] bg-[#D4C5B0] text-3xl font-bold text-[#8B6F4E]">
                                {user.name?.[0] ?? "U"}
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h1
                                    className="mb-1 text-3xl font-bold text-[#1A1A1A]"
                                    style={{ letterSpacing: "-0.03em" }}
                                >
                                    {user.name ?? "Untitled user"}
                                </h1>
                                <p
                                    className="mb-3 text-sm text-[#999] font-sans"
                                    style={{ fontFamily: "system-ui, sans-serif" }}
                                >
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs ${
                                            isAuthor
                                                ? "bg-[#F0EDE8] text-[#8B6F4E]"
                                                : "bg-[#F0F0F0] text-[#888]"
                                        }`}
                                    >
                                        {isAuthor ? "Author" : "Reader"}
                                    </span>
                                </p>
                                {user.bio && (
                                    <p
                                        className="max-w-lg text-base leading-relaxed text-[#555] font-sans"
                                        style={{ fontFamily: "system-ui, sans-serif" }}
                                    >
                                        {user.bio}
                                    </p>
                                )}
                            </div>

                            {isOwner && (
                                <Link
                                    href="/setting"
                                    className="shrink-0 rounded-full border border-[#E0DDD8] px-4 py-2 text-sm text-[#666] transition-all hover:border-[#C4B99A] hover:text-[#1A1A1A] font-sans"
                                    style={{ fontFamily: "system-ui, sans-serif" }}
                                >
                                    Edit profile
                                </Link>
                            )}
                        </div>

                        {isAuthor && (
                            <div className="mt-4 flex flex-wrap items-center gap-4">
                                {user.website && (
                                    <a
                                        href={user.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-[#8B6F4E] hover:underline font-sans"
                                        style={{ fontFamily: "system-ui, sans-serif" }}
                                    >
                                        Website
                                    </a>
                                )}
                                {user.twitter && (
                                    <a
                                        href={`https://twitter.com/${user.twitter}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-[#8B6F4E] hover:underline font-sans"
                                        style={{ fontFamily: "system-ui, sans-serif" }}
                                    >
                                        X @{user.twitter}
                                    </a>
                                )}
                                {user.github && (
                                    <a
                                        href={`https://github.com/${user.github}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-[#8B6F4E] hover:underline font-sans"
                                        style={{ fontFamily: "system-ui, sans-serif" }}
                                    >
                                        GitHub {user.github}
                                    </a>
                                )}
                            </div>
                        )}

                        {isAuthor && (
                            <div className="mt-6 flex items-center gap-6">
                                {[
                                    { label: "Articles", value: user.posts.length },
                                    {
                                        label: "Likes received",
                                        value: totalLikesReceived,
                                    },
                                ].map((stat: { label: string; value: number }) => (
                                    <div key={stat.label}>
                                        <p
                                            className="text-2xl font-bold text-[#1A1A1A]"
                                            style={{ letterSpacing: "-0.03em" }}
                                        >
                                            {stat.value}
                                        </p>
                                        <p
                                            className="text-xs text-[#999] font-sans"
                                            style={{ fontFamily: "system-ui, sans-serif" }}
                                        >
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {isAuthor ? (
                    <section>
                        <h2
                            className="mb-6 text-xl font-bold"
                            style={{ letterSpacing: "-0.02em" }}
                        >
                            Articles by {user.name ?? "this author"}
                        </h2>

                        {user.posts.length === 0 ? (
                            <p
                                className="text-sm text-[#999] font-sans"
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                No articles published yet.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {user.posts.map((post: ProfilePost) => (
                                    <Link key={post.id} href={`/blog/${post.slug}`}>
                                        <div className="group flex items-start gap-5 rounded-2xl border border-[#E0DDD8] bg-white p-5 transition-all hover:border-[#C4B99A] hover:shadow-sm">
                                            {post.coverImage ? (
                                                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#E0DDD8]">
                                                    <Image
                                                        src={post.coverImage}
                                                        alt={post.title}
                                                        fill
                                                        sizes="80px"
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-[#E0DDD8] bg-[#F0EDE8] text-2xl">
                                                    *
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-1.5 flex flex-wrap gap-1.5">
                                                    {post.tags.slice(0, 2).map((tag: Tag) => (
                                                        <span
                                                            key={tag.id}
                                                            className="rounded-full bg-[#F0EDE8] px-2 py-0.5 text-xs text-[#8B6F4E] font-sans"
                                                            style={{
                                                                fontFamily:
                                                                    "system-ui, sans-serif",
                                                            }}
                                                        >
                                                            {tag.name}
                                                        </span>
                                                    ))}
                                                </div>
                                                <h3
                                                    className="mb-1 font-bold leading-snug text-[#1A1A1A] transition-colors group-hover:text-[#8B6F4E]"
                                                    style={{ letterSpacing: "-0.01em" }}
                                                >
                                                    {post.title}
                                                </h3>
                                                {post.excerpt && (
                                                    <p
                                                        className="mb-2 line-clamp-1 text-xs text-[#888] font-sans"
                                                        style={{
                                                            fontFamily:
                                                                "system-ui, sans-serif",
                                                        }}
                                                    >
                                                        {post.excerpt}
                                                    </p>
                                                )}
                                                <div
                                                    className="flex items-center gap-3 text-xs text-[#999] font-sans"
                                                    style={{ fontFamily: "system-ui, sans-serif" }}
                                                >
                                                    <span>
                                                        {new Date(
                                                            post.createdAt,
                                                        ).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        })}
                                                    </span>
                                                    <span>{post._count.likes} likes</span>
                                                    <span>
                                                        {post._count.comments} comments
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <p
                            className="mb-4 text-sm text-[#999] font-sans"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            {isOwner
                                ? "You are a reader. Explore and interact with articles."
                                : "This user is a reader."}
                        </p>
                        <Link
                            href="/blog"
                            className="rounded-full bg-[#1A1A1A] px-5 py-2.5 text-sm text-[#F9F7F4] transition-colors hover:bg-[#333] font-sans"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            Browse articles
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProfilePage;
