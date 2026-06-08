"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type CommentUser = {
    id: string;
    name: string | null;
    image: string | null;
    role: string;
};

type CommentItem = {
    id: string;
    content: string;
    createdAt: string | Date;
    user: CommentUser;
    replies?: CommentItem[];
};

type Props = {
    postId: string;
    postAuthorId: string;
    initialComments: CommentItem[];
    canComment: boolean;
};

const formatDate = (date: string | Date) =>
    new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

const Comments = ({
    postId,
    postAuthorId,
    initialComments,
    canComment,
}: Props) => {
    const router = useRouter();
    const [comments, setComments] = useState(initialComments);
    const [content, setContent] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submitComment = async (
        event: FormEvent<HTMLFormElement>,
        parentId?: string,
    ) => {
        event.preventDefault();

        if (!canComment) {
            router.push("/signin");
            return;
        }

        const bodyContent = parentId ? replyContent : content;
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/posts/${postId}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: bodyContent, parentId }),
        });
        const data = await res.json();

        setLoading(false);

        if (!res.ok) {
            setError(data.error ?? "Could not save comment");
            return;
        }

        if (parentId) {
            setComments((current) =>
                current.map((comment: CommentItem) =>
                    comment.id === parentId
                        ? {
                              ...comment,
                              replies: [
                                  ...(comment.replies ?? []),
                                  data.comment,
                              ],
                          }
                        : comment,
                ),
            );
            setReplyingTo(null);
            setReplyContent("");
        } else {
            setComments((current) => [data.comment, ...current]);
            setContent("");
        }

        router.refresh();
    };

    const renderComment = (comment: CommentItem, isReply = false) => {
        const isPostAuthor = comment.user.id === postAuthorId;

        return (
            <div
                key={comment.id}
                className={`border-[#E0DDD8] ${isReply ? "border-l pl-4" : "border-t pt-5"}`}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <p
                                className="text-sm font-semibold text-[#1A1A1A]"
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                {comment.user.name ?? "Reader"}
                            </p>
                            {isPostAuthor && (
                                <span
                                    className="rounded-full bg-[#F0EDE8] px-2 py-0.5 text-xs text-[#8B6F4E]"
                                    style={{
                                        fontFamily: "system-ui, sans-serif",
                                    }}
                                >
                                    Author
                                </span>
                            )}
                            <span
                                className="text-xs text-[#999]"
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                {formatDate(comment.createdAt)}
                            </span>
                        </div>
                        <p
                            className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#555]"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            {comment.content}
                        </p>
                    </div>
                    {!isReply && canComment && (
                        <button
                            type="button"
                            onClick={() =>
                                setReplyingTo(
                                    replyingTo === comment.id
                                        ? null
                                        : comment.id,
                                )
                            }
                            className="text-xs text-[#8B6F4E] hover:text-[#1A1A1A]"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            Reply
                        </button>
                    )}
                </div>

                {replyingTo === comment.id && (
                    <form
                        onSubmit={(event) => submitComment(event, comment.id)}
                        className="mt-4 space-y-3"
                    >
                        <textarea
                            value={replyContent}
                            onChange={(event) =>
                                setReplyContent(event.target.value)
                            }
                            rows={3}
                            className="w-full rounded-xl border border-[#E0DDD8] bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-colors focus:border-[#8B6F4E]"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                            placeholder="Write a reply..."
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-full bg-[#1A1A1A] px-4 py-2 text-sm text-white transition-colors hover:bg-[#333] disabled:opacity-60"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            Reply
                        </button>
                    </form>
                )}

                {(comment.replies?.length ?? 0) > 0 && (
                    <div className="mt-5 space-y-5">
                        {comment.replies?.map((reply: CommentItem) =>
                            renderComment(reply, true),
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <section className="mt-14">
            <div className="mb-6 flex items-center justify-between gap-4">
                <h2
                    className="text-2xl font-bold text-[#1A1A1A]"
                    style={{ letterSpacing: "-0.02em" }}
                >
                    Comments
                </h2>
                <span
                    className="text-sm text-[#888]"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                >
                    {comments.length}
                </span>
            </div>

            {canComment ? (
                <form onSubmit={submitComment} className="mb-8 space-y-3">
                    <textarea
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        rows={4}
                        className="w-full rounded-xl border border-[#E0DDD8] bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-colors focus:border-[#8B6F4E]"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                        placeholder="Join the discussion..."
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-full bg-[#1A1A1A] px-5 py-2 text-sm text-white transition-colors hover:bg-[#333] disabled:opacity-60"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        Post comment
                    </button>
                </form>
            ) : (
                <div className="mb-8 rounded-xl border border-[#E0DDD8] bg-white px-5 py-4">
                    <p
                        className="text-sm text-[#666]"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        Sign in to like or comment.
                    </p>
                </div>
            )}

            {error && (
                <p
                    className="mb-4 text-sm text-red-600"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                >
                    {error}
                </p>
            )}

            <div className="space-y-5">
                {comments.length === 0 ? (
                    <p
                        className="text-sm text-[#888]"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        No comments yet.
                    </p>
                ) : (
                    comments.map((comment: CommentItem) =>
                        renderComment(comment),
                    )
                )}
            </div>
        </section>
    );
};

export default Comments;
