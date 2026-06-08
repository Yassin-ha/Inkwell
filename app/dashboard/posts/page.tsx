"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DeletePostButton from "@/components/dashboard/DeletePostButton";
import PublishToggle from "@/components/dashboard/PublishToggle";
import { Post, Tag } from "@/types/types"

type Filter = "all" | "published" | "draft";

const MyPostsPage = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<Filter>("all");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await fetch("/api/posts/mine");
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
            setLoading(false);
        };
        fetchPosts();
    }, []);

    const filtered = posts.filter((post) => {
        const matchesFilter =
            filter === "all" ||
            (filter === "published" && post.published) ||
            (filter === "draft" && !post.published);
        const matchesSearch =
            post.title.toLowerCase().includes(search.toLowerCase()) ||
            post.tags.some((t) =>
                t.name.toLowerCase().includes(search.toLowerCase()),
            );
        return matchesFilter && matchesSearch;
    });

    const counts = {
        all: posts.length,
        published: posts.filter((p) => p.published).length,
        draft: posts.filter((p) => !p.published).length,
    };

    return (
        <div className="px-10 py-10 w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1
                        className="text-3xl font-bold text-[#1A1A1A]"
                        style={{ letterSpacing: "-0.03em" }}
                    >
                        My Posts
                    </h1>
                    <p
                        className="text-[#666] text-sm mt-1 font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        {counts.all} total · {counts.published} published ·{" "}
                        {counts.draft} drafts
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

            {/* Filters + Search */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                {/* Filter tabs */}
                <div className="flex items-center gap-1 bg-white border border-[#E0DDD8] rounded-xl p-1">
                    {(["all", "published", "draft"] as Filter[]).map((f: Filter) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 text-xs rounded-lg capitalize transition-all font-sans ${
                                filter === f
                                    ? "bg-[#F9F7F4] text-[#1A1A1A]"
                                    : "text-[#666] hover:text-[#1A1A1A]"
                            }`}
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            {f} ({counts[f]})
                        </button>
                    ))}
                </div>

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search by title or tag..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-white border border-[#E0DDD8] rounded-xl px-4 py-2 text-sm text-[#1A1A1A] placeholder-[#999] outline-none focus:border-[#8B6F4E] transition-colors font-sans"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                />
            </div>

            {/* Posts list */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <p
                        className="text-[#666] text-sm font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        Loading posts...
                    </p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <p
                        className="text-[#666] text-sm font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        {search || filter !== "all"
                            ? "No posts match your filter."
                            : "No posts yet."}
                    </p>
                    {!search && filter === "all" && (
                        <Link
                            href="/dashboard/new"
                            className="text-sm text-[#8B6F4E] hover:text-[#A0845E] underline font-sans"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            Write your first post →
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((post: Post) => (
                        <div
                            key={post.id}
                            className="group bg-white border border-[#E0DDD8] hover:border-[#CCC] rounded-2xl px-6 py-5 flex items-start justify-between gap-6 transition-all"
                        >
                            {/* Left — post info */}
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                                {/* Cover thumbnail */}
                                {post.coverImage ? (
                                    <div
                                        className="w-16 h-16 rounded-lg shrink-0 bg-cover bg-center border border-[#E0DDD8]"
                                        style={{
                                            backgroundImage: `url(${post.coverImage})`,
                                        }}
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-lg shrink-0 bg-[#F9F7F4] border border-[#E0DDD8] flex items-center justify-center text-[#CCC] text-xl">
                                        ✦
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    {/* Status + tags row */}
                                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                        <span
                                            className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-sans ${
                                                post.published
                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                    : "bg-gray-50 text-gray-600 border border-gray-200"
                                            }`}
                                            style={{
                                                fontFamily:
                                                    "system-ui, sans-serif",
                                            }}
                                        >
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full ${post.published ? "bg-emerald-500" : "bg-gray-400"}`}
                                            />
                                            {post.published
                                                ? "Published"
                                                : "Draft"}
                                        </span>
                                        {post.tags.map((tag: Tag) => (
                                            <span
                                                key={tag.id}
                                                className="text-xs px-2 py-0.5 rounded-full bg-[#F9F7F4] text-[#666] border border-[#E0DDD8] font-sans"
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
                                    <h3
                                        className="font-bold text-[#1A1A1A] text-base truncate mb-1"
                                        style={{ letterSpacing: "-0.01em" }}
                                    >
                                        {post.title}
                                    </h3>

                                    {/* Excerpt */}
                                    {post.excerpt && (
                                        <p
                                            className="text-xs text-[#666] line-clamp-1 font-sans"
                                            style={{
                                                fontFamily:
                                                    "system-ui, sans-serif",
                                            }}
                                        >
                                            {post.excerpt}
                                        </p>
                                    )}

                                    {/* Date */}
                                    <p
                                        className="text-xs text-[#999] mt-1.5 font-sans"
                                        style={{
                                            fontFamily: "system-ui, sans-serif",
                                        }}
                                    >
                                        {post.published
                                            ? "Published"
                                            : "Last updated"}{" "}
                                        {new Date(
                                            post.updatedAt,
                                        ).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Right — actions */}
                            <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                {post.published && (
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        target="_blank"
                                        className="px-3 py-1.5 text-xs text-[#666] hover:text-[#1A1A1A] border border-[#E0DDD8] hover:border-[#CCC] rounded-lg transition-all font-sans"
                                        style={{
                                            fontFamily: "system-ui, sans-serif",
                                        }}
                                    >
                                        View ↗
                                    </Link>
                                )}
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
    );
};

export default MyPostsPage;
