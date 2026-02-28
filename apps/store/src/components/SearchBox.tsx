"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Product {
    _id: string;
    name: string;
    slug: string;
    price: number;
    brand: string;
    image?: { url: string };
}

export function SearchBox() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const fetchResults = useCallback(async (q: string) => {
        if (!q.trim()) {
            setResults([]);
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}`);
            const data = await res.json();
            setResults(data.products || []);
        } catch (error) {
            console.error("Search fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length > 1) {
                fetchResults(query);
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, fetchResults]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        } else if (e.key === "ArrowUp") {
            setSelectedIndex((prev) => (prev > -1 ? prev - 1 : prev));
        } else if (e.key === "Enter") {
            if (selectedIndex >= 0 && results[selectedIndex]) {
                router.push(`/product/${results[selectedIndex].slug}`);
                setIsOpen(false);
            } else if (query) {
                router.push(`/search?q=${encodeURIComponent(query)}`);
                setIsOpen(false);
            }
        } else if (e.key === "Escape") {
            setIsOpen(false);
        }
    };

    const clearSearch = () => {
        setQuery("");
        setResults([]);
        inputRef.current?.focus();
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-sm">
            <div
                className={cn(
                    "group relative flex items-center transition-all duration-300 ease-in-out",
                    isOpen ? "w-full" : "w-10 sm:w-64"
                )}
            >
                <div className="absolute left-3 text-black/40 group-focus-within:text-black transition-colors">
                    <Search size={16} strokeWidth={2.5} />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                        setSelectedIndex(-1);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search fragrances..."
                    className={cn(
                        "h-10 w-full rounded-full bg-black/5 pl-10 pr-10 text-sm outline-hidden transition-all placeholder:text-black/30",
                        "focus:bg-white focus:ring-1 focus:ring-black/10 focus:shadow-[0_4px_20px_rgba(0,0,0,0.05)]",
                        !isOpen && "sm:bg-transparent sm:hover:bg-black/5"
                    )}
                />
                {(query || isLoading) && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 flex items-center justify-center text-black/40 hover:text-black transition-colors"
                    >
                        {isLoading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <X size={16} strokeWidth={2.5} />
                        )}
                    </button>
                )}
            </div>

            {isOpen && (query.length > 1 || results.length > 0) && (
                <div className="absolute top-full mt-3 w-full overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-black/5 z-50">
                    <div className="p-2">
                        {results.length > 0 ? (
                            <div className="flex flex-col gap-1">
                                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-black/30">
                                    Products
                                </div>
                                {results.map((product, index) => (
                                    <Link
                                        key={product._id}
                                        href={`/product/${product.slug}`}
                                        className={cn(
                                            "group flex items-center justify-between gap-3 rounded-xl p-3 transition-all",
                                            selectedIndex === index ? "bg-black/5" : "hover:bg-black/5"
                                        )}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <div className="flex items-center gap-3">
                                            {product.image?.url ? (
                                                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-black/5">
                                                    <img
                                                        src={product.image.url}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-black/5" />
                                            )}
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-black">{product.name}</span>
                                                <span className="text-[10px] text-black/40 uppercase tracking-tighter">
                                                    {product.brand}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-black/60">
                                                €{product.price}
                                            </span>
                                            <ArrowRight
                                                size={14}
                                                className={cn(
                                                    "text-black/20 transition-all",
                                                    selectedIndex === index ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                                                )}
                                            />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : !isLoading ? (
                            <div className="p-8 text-center">
                                <p className="text-sm text-black/40 italic">No products found matching "{query}"</p>
                            </div>
                        ) : null}

                        {query.length > 1 && (
                            <Link
                                href={`/search?q=${encodeURIComponent(query)}`}
                                className="mt-2 block rounded-xl border-t border-black/5 p-3 text-center text-xs font-semibold text-black/60 hover:bg-black/5 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                View all results for "{query}"
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
