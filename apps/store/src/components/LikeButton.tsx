"use client";

import { useState } from "react";

export function LikeButton({
    productId,
    initialLikes,
    initialHasLiked
}: {
    productId: string;
    initialLikes: number;
    initialHasLiked: boolean;
}) {
    const [likes, setLikes] = useState(initialLikes);
    const [hasLiked, setHasLiked] = useState(initialHasLiked);
    const [isLoading, setIsLoading] = useState(false);

    const toggleLike = async () => {
        if (isLoading) return;
        setIsLoading(true);

        // Optimistic UI update
        setHasLiked(!hasLiked);
        setLikes(prev => hasLiked ? prev - 1 : prev + 1);

        try {
            const res = await fetch(`/api/products/${productId}/like`, {
                method: "POST"
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                // Revert on failure
                setHasLiked(hasLiked);
                setLikes(initialLikes);
            }
        } catch {
            // Revert on error
            setHasLiked(hasLiked);
            setLikes(initialLikes);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={toggleLike}
            disabled={isLoading}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${hasLiked
                    ? "border-[#E4405F]/50 bg-[#E4405F]/10 text-[#E4405F]"
                    : "border-black/10 bg-white hover:border-black/20"
                }`}
        >
            <div className={hasLiked ? "" : "text-black/60"}>{hasLiked ? "♥" : "♡"}</div>
            <div className="tabular-nums text-black">{likes.toLocaleString("en-GB")}</div>
        </button>
    );
}
