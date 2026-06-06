"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const PublishToggle = ({
    postId,
    published,
}: {
    postId: string;
    published: boolean;
}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const toggle = async () => {
        setLoading(true);
        await fetch(`/api/posts/${postId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ published: !published }),
        });
        setLoading(false);
        router.refresh();
    };

    return (
        <button
            onClick={toggle}
            disabled={loading}
            className={`px-3 py-1.5 text-xs border rounded-lg transition-all font-sans disabled:opacity-50 ${
                published
                    ? "text-emerald-400 border-emerald-900 hover:border-emerald-700"
                    : "text-[#888] border-[#2A2A2A] hover:border-[#444] hover:text-[#F0EDE8]"
            }`}
            style={{ fontFamily: "system-ui, sans-serif" }}
        >
            {loading ? "..." : published ? "Unpublish" : "Publish"}
        </button>
    );
};

export default PublishToggle;
