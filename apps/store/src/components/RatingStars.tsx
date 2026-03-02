"use client";

import { useState } from "react";

export function RatingStars({
    productId,
    initialRating,
    initialCount,
    initialUserRating = null
}: {
    productId: string;
    initialRating: number;
    initialCount: number;
    initialUserRating?: number | null;
}) {
    const [rating, setRating] = useState(initialRating);
    const [count, setCount] = useState(initialCount);
    const [userRating, setUserRating] = useState<number | null>(initialUserRating);
    const [hoveredStar, setHoveredStar] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const submitRating = async (val: number) => {
        if (isLoading) return;
        setIsLoading(true);

        // Optimistic UI update so it immediately persists after click
        const previousUserRating = userRating;
        const previousRating = rating;
        setUserRating(val);

        try {
            const res = await fetch(`/api/products/${productId}/rate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating: val })
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setRating(data.newAverage);
                if (data.count) {
                    setCount(data.count);
                }
            } else {
                // Revert completely on soft failure
                setUserRating(previousUserRating);
                setRating(previousRating);
            }
        } catch (e) {
            console.error(e);
            // Revert completely on network failure
            setUserRating(previousUserRating);
            setRating(previousRating);
        } finally {
            setIsLoading(false);
        }
    };

    const ratingRounded = Math.round(rating * 10) / 10;

    return (
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-2">
            <div className="text-3xl font-semibold tabular-nums">{ratingRounded > 0 ? ratingRounded.toFixed(1) : "0.0"}</div>
            <div>
                <div className="flex items-center gap-1 cursor-pointer pointer-events-auto">
                    {Array.from({ length: 5 }).map((_, i) => {
                        const starValue = i + 1;
                        const isFilled = hoveredStar !== null
                            ? starValue <= hoveredStar
                            : userRating !== null
                                ? starValue <= userRating
                                : starValue <= Math.round(ratingRounded);

                        return (
                            <span
                                key={i}
                                className={`text-2xl transition-colors ${isFilled ? "text-yellow-500" : "text-black/20 hover:text-yellow-500/50"}`}
                                onMouseEnter={() => setHoveredStar(starValue)}
                                onMouseLeave={() => setHoveredStar(null)}
                                onClick={() => submitRating(starValue)}
                                title={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
                                style={{ WebkitTapHighlightColor: "transparent" }}
                            >
                                ★
                            </span>
                        );
                    })}
                </div>
                <div className="text-sm text-black/60">({count.toLocaleString("en-GB")} ratings)</div>
            </div>
        </div>
    );
}
