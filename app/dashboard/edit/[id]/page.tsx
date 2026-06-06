"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import slugify from "slugify";
import Link from "next/link";
import CoverImageUpload from "@/components/editor/CoverImageUpload";

const PostEditor = dynamic(() => import("@/components/editor/Posteditor"), {
    ssr: false,
    loading: () => (
        <div className="border border-[#E0DDD8] rounded-xl min-h-[400px] bg-white flex items-center justify-center">
            <span className="text-[#666] text-sm font-sans">
                Loading editor...
            </span>
        </div>
    ),
});

const EditPostPage = () => {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [published, setPublished] = useState(false);
    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notFound, setNotFound] = useState(false);

    const slug = slugify(title, { lower: true, strict: true });

    // Fetch existing post on mount
    useEffect(() => {
        const fetchPost = async () => {
            const res = await fetch(`/api/posts/${id}`);
            if (!res.ok) {
                setNotFound(true);
                setLoading(false);
                return;
            }
            const post = await res.json();
            setTitle(post.title);
            setExcerpt(post.excerpt ?? "");
            setContent(post.content);
            setCoverImage(post.coverImage ?? "");
            setPublished(post.published);
            setTags(
                post.tags?.map((t: { name: string }) => t.name).join(", ") ??
                    "",
            );
            setLoading(false);
        };
        fetchPost();
    }, [id]);

    const handleSave = async (publish: boolean) => {
        if (!title.trim()) {
            setError("Title is required");
            return;
        }
        if (!content.trim() || content === "<p></p>") {
            setError("Content is required");
            return;
        }

        setError(null);
        if (publish) {
            setPublishing(true);
        } else {
            setSaving(true);
        }

        const tagList = tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

        const res = await fetch(`/api/posts/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                slug,
                excerpt,
                content,
                coverImage,
                published: publish,
                tags: tagList,
            }),
        });

        const data = await res.json();
        setPublishing(false);
        setSaving(false);

        if (!res.ok) {
            setError(data.error ?? "Something went wrong");
            return;
        }

        router.push("/dashboard");
        router.refresh();
    };

    // Loading state
    if (loading) {
        return (
            <div className="px-10 py-10 flex items-center justify-center min-h-[60vh]">
                <p
                    className="text-[#666] text-sm font-sans"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                >
                    Loading post...
                </p>
            </div>
        );
    }

    // Not found state
    if (notFound) {
        return (
            <div className="px-10 py-10 flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-[#1A1A1A] text-lg font-bold">
                    Post not found
                </p>
                <Link
                    href="/dashboard"
                    className="text-sm text-[#8B6F4E] hover:text-[#A0845E] underline font-sans"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                >
                    ← Back to dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="px-10 py-10 w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="text-[#666] hover:text-[#1A1A1A] transition-colors text-sm font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        ← Back
                    </Link>
                    <h1
                        className="text-2xl font-bold text-[#1A1A1A]"
                        style={{ letterSpacing: "-0.03em" }}
                    >
                        Edit Post
                    </h1>
                    {/* Published badge */}
                    <span
                        className={`text-xs px-2.5 py-1 rounded-full font-sans ${
                            published
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-gray-50 text-gray-600 border border-gray-200"
                        }`}
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        {published ? "Published" : "Draft"}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleSave(false)}
                        disabled={saving || publishing}
                        className="px-4 py-2 text-sm text-[#666] border border-[#E0DDD8] hover:border-[#CCC] hover:text-[#1A1A1A] rounded-full transition-all font-sans disabled:opacity-50"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        {saving ? "Saving..." : "Save draft"}
                    </button>
                    <button
                        onClick={() => handleSave(true)}
                        disabled={saving || publishing}
                        className="px-4 py-2 text-sm bg-[#8B6F4E] hover:bg-[#A0845E] text-white rounded-full transition-colors font-sans disabled:opacity-50"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        {publishing
                            ? "Publishing..."
                            : published
                              ? "Update"
                              : "Publish"}
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div
                    className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-sans"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                >
                    {error}
                </div>
            )}

            <div className="space-y-5">
                {/* Title */}
                <div>
                    <input
                        type="text"
                        placeholder="Post title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-transparent text-3xl font-bold text-[#1A1A1A] placeholder-[#999] outline-none border-b border-[#E0DDD8] pb-4 focus:border-[#8B6F4E] transition-colors"
                        style={{
                            letterSpacing: "-0.03em",
                            fontFamily: "'Georgia', serif",
                        }}
                    />
                    {slug && (
                        <p
                            className="mt-2 text-xs text-[#666] font-sans"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            URL:{" "}
                            <span className="text-[#8B6F4E]">/blog/{slug}</span>
                        </p>
                    )}
                </div>

                {/* Excerpt */}
                <div>
                    <label
                        className="block text-xs tracking-[0.15em] uppercase text-[#666] mb-2 font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        Excerpt (optional)
                    </label>
                    <textarea
                        placeholder="A short summary shown on the home page..."
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        rows={2}
                        className="w-full bg-white border border-[#E0DDD8] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#999] outline-none focus:border-[#8B6F4E] transition-colors resize-none font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    />
                </div>

                {/* Tags */}
                <div>
                    <label
                        className="block text-xs tracking-[0.15em] uppercase text-[#666] mb-2 font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        Tags (comma separated)
                    </label>
                    <input
                        type="text"
                        placeholder="Next.js, React, TypeScript..."
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="w-full bg-white border border-[#E0DDD8] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#999] outline-none focus:border-[#8B6F4E] transition-colors font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    />
                </div>

                {/* Cover Image */}
                <div>
                    <label
                        className="block text-xs tracking-[0.15em] uppercase text-[#666] mb-2 font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        Cover Image
                    </label>
                    <CoverImageUpload
                        value={coverImage}
                        onChange={setCoverImage}
                    />
                </div>

                {/* Editor */}
                <div>
                    <label
                        className="block text-xs tracking-[0.15em] uppercase text-[#666] mb-2 font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        Content
                    </label>
                    <PostEditor content={content} onChange={setContent} />
                </div>
            </div>
        </div>
    );
};

export default EditPostPage;