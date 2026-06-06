"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const DeletePostButton = ({ postId }: { postId: string }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        const confirmed = confirm(
            "Are you sure you want to delete this post? This cannot be undone.",
        );
        if (!confirmed) return;

        setLoading(true);
        await fetch(`/api/posts/${postId}`, { method: "DELETE" });
        setLoading(false);
        router.refresh();
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="px-3 py-1.5 text-xs text-red-500 border border-[#2A2A2A] hover:border-red-900 hover:bg-red-950/30 rounded-lg transition-all font-sans disabled:opacity-50"
            style={{ fontFamily: "system-ui, sans-serif" }}
        >
            {loading ? "..." : "Delete"}
        </button>
    );
};

export default DeletePostButton;
