"use client";

import { useState } from "react";

export function ReadMoreText({ text, maxLength = 150 }: { text: string; maxLength?: number }) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!text || text.length <= maxLength) {
        return <div className="text-sm leading-7 text-black/70">{text}</div>;
    }

    return (
        <div className="text-sm leading-7 text-black/70">
            {isExpanded ? text : `${text.slice(0, maxLength)}...`}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-2 font-medium text-black underline underline-offset-2 hover:text-black/70"
            >
                {isExpanded ? "Read less" : "Read more"}
            </button>
        </div>
    );
}
