"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
    postId: string;
    initialLiked: boolean;
    initialCount: number;
    canLike: boolean;
};

const LikeButton = ({ postId, initialLiked, initialCount, canLike }: Props) => {
    const router = useRouter();
    const [liked, setLiked] = useState(initialLiked);
    const [count, setCount] = useState(initialCount);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toggleLike = async () => {
        if (!canLike) {
            router.push("/signin");
            return;
        }

        setLoading(true);
        setError(null);

        const res = await fetch(`/api/posts/${postId}/like`, {
            method: "POST",
        });
        const data = await res.json();

        setLoading(false);

        if (!res.ok) {
            setError(data.error ?? "Could not update like");
            return;
        }

        setLiked(data.liked);
        setCount(data.count);
        router.refresh();
    };

    return (
        <div className="flex flex-col gap-1">
            <button
                type="button"
                onClick={toggleLike}
                disabled={loading}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all disabled:opacity-60 ${
                    liked
                        ? "border-[#8B6F4E] bg-[#8B6F4E] text-white"
                        : "border-[#E0DDD8] bg-white text-[#555] hover:border-[#C4B99A] hover:text-[#1A1A1A]"
                }`}
                style={{ fontFamily: "system-ui, sans-serif" }}
            >
                <span>{liked ? "Liked" : "Like"}</span>
                <span>{count}</span>
            </button>
            {error && (
                <p
                    className="text-xs text-red-600"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                >
                    {error}
                </p>
            )}
        </div>
    );
};

export default LikeButton;

