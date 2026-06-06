"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import slugify from "slugify";
import Link from "next/link";
import CoverImageUpload from "@/components/editor/CoverImageUpload";

// Load editor only on client to avoid SSR issues
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

const NewPostPage = () => {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [publishing, setPublishing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const slug = slugify(title, { lower: true, strict: true });

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

        const res = await fetch("/api/posts", {
            method: "POST",
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
                        New Post
                    </h1>
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
                        {publishing ? "Publishing..." : "Publish"}
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
                    {/* Slug preview */}
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

export default NewPostPage;
