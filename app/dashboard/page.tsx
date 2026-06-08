import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeletePostButton from "@/components/dashboard/DeletePostButton";
import PublishToggle from "@/components/dashboard/PublishToggle";

const DashboardPage = async () => {
    const session = await auth();
    if (!session?.user?.id) redirect("/signin");

    const [totalPosts, publishedPosts, draftPosts, recentPosts] =
        await Promise.all([
            prisma.post.count({ where: { authorId: session.user.id } }),
            prisma.post.count({
                where: { authorId: session.user.id, published: true },
            }),
            prisma.post.count({
                where: { authorId: session.user.id, published: false },
            }),
            prisma.post.findMany({
                where: { authorId: session.user.id },
                orderBy: { createdAt: "desc" },
                take: 10,
            }),
        ]);

    const stats = [
        { label: "Total Posts", value: totalPosts, icon: "≡" },
        { label: "Published", value: publishedPosts, icon: "◉" },
        { label: "Drafts", value: draftPosts, icon: "◎" },
    ];
    type DashboardStat = (typeof stats)[number];
    type RecentPost = (typeof recentPosts)[number];

    return (
        <div className="px-10 py-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1
                        className="text-3xl font-bold text-[#1A1A1A]"
                        style={{ letterSpacing: "-0.03em" }}
                    >
                        Good to see you, {session.user?.name?.split(" ")[0]} ✦
                    </h1>
                    <p
                        className="text-[#666] text-sm mt-1 font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        Here&apos;s what&apos;s happening with your blog
                    </p>
                </div>
                <Link
                    href="/dashboard/new"
                    className="flex items-center gap-2 bg-[#8B6F4E] hover:bg-[#A0845E] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors font-sans"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                >
                    <span>✦</span>
                    New post
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-5 mb-10">
                {stats.map((stat: DashboardStat) => (
                    <div
                        key={stat.label}
                        className="bg-white border border-[#E0DDD8] rounded-2xl p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span
                                className="text-xs tracking-[0.15em] uppercase text-[#666] font-sans"
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                {stat.label}
                            </span>
                            <span className="text-[#8B6F4E] text-lg">
                                {stat.icon}
                            </span>
                        </div>
                        <p
                            className="text-4xl font-bold text-[#1A1A1A]"
                            style={{ letterSpacing: "-0.04em" }}
                        >
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Posts table */}
            <div className="bg-white border border-[#E0DDD8] rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-[#E0DDD8] flex items-center justify-between">
                    <h2
                        className="text-sm font-semibold text-[#1A1A1A] font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        Your Posts
                    </h2>
                    <span
                        className="text-xs text-[#666] font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        {totalPosts} total
                    </span>
                </div>

                {recentPosts.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <p
                            className="text-[#666] text-sm font-sans"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            No posts yet.{" "}
                            <Link
                                href="/dashboard/new"
                                className="text-[#8B6F4E] hover:text-[#A0845E] underline"
                            >
                                Write your first one →
                            </Link>
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-[#E0DDD8]">
                        {recentPosts.map((post: RecentPost) => (
                            <div
                                key={post.id}
                                className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-[#F9F7F4] transition-colors group"
                            >
                                {/* Post info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span
                                            className={`inline-block w-2 h-2 rounded-full shrink-0 ${post.published ? "bg-emerald-500" : "bg-[#BBB]"}`}
                                        />
                                        <h3
                                            className="text-sm font-medium text-[#1A1A1A] truncate"
                                            style={{
                                                fontFamily:
                                                    "system-ui, sans-serif",
                                            }}
                                        >
                                            {post.title}
                                        </h3>
                                    </div>
                                    <p
                                        className="text-xs text-[#666] pl-5 font-sans"
                                        style={{
                                            fontFamily: "system-ui, sans-serif",
                                        }}
                                    >
                                        {post.published ? "Published" : "Draft"}{" "}
                                        ·{" "}
                                        {new Date(
                                            post.createdAt,
                                        ).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <PublishToggle
                                        postId={post.id}
                                        published={post.published}
                                    />
                                    <Link
                                        href={`/dashboard/edit/${post.id}`}
                                        className="px-3 py-1.5 text-xs text-[#666] hover:text-[#1A1A1A] border border-[#E0DDD8] hover:border-[#CCC] rounded-lg transition-all font-sans"
                                        style={{
                                            fontFamily: "system-ui, sans-serif",
                                        }}
                                    >
                                        Edit
                                    </Link>
                                    <DeletePostButton postId={post.id} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
