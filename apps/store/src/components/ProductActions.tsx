"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/lib/types";

type VariantOption = {
    optionName: string;
    values: { label: string; price: number }[];
};

interface ProductActionsProps {
    product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
    const cart = useCart();
    const variants = product.variants ?? [];
    const hasVariants = variants.length > 0 && variants.some((v) => v.values.length > 0);

    // Track the selected value index for each option
    const [selections, setSelections] = useState<Record<string, number>>(() => {
        const initial: Record<string, number> = {};
        variants.forEach((opt) => {
            if (opt.values.length > 0) {
                initial[opt.optionName] = 0; // default to first value
            }
        });
        return initial;
    });

    function selectValue(optionName: string, valIdx: number) {
        setSelections((prev) => ({ ...prev, [optionName]: valIdx }));
    }

    // Determine effective price: use the first variant's selected price, or base price
    let effectivePrice = product.price;
    let selectedVariantInfo: { optionName: string; value: string; price: number } | undefined;

    if (hasVariants) {
        // Use the first option's selected value price
        const firstOpt = variants[0];
        const selectedIdx = selections[firstOpt.optionName] ?? 0;
        const selectedVal = firstOpt.values[selectedIdx];
        if (selectedVal) {
            effectivePrice = selectedVal.price;
            selectedVariantInfo = {
                optionName: firstOpt.optionName,
                value: selectedVal.label,
                price: selectedVal.price,
            };
        }
    }

    function handleAddToCart() {
        cart.add(product, 1, selectedVariantInfo);
    }

    return (
        <div className="rounded-3xl border border-black/10 p-5">
            {/* Variant selector pills */}
            {hasVariants && (
                <div className="mb-4 grid gap-3">
                    {variants.map((opt) => (
                        <div key={opt.optionName}>
                            <div className="text-xs uppercase tracking-[0.22em] text-black/50 mb-2">
                                {opt.optionName}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {opt.values.map((val, valIdx) => {
                                    const isSelected = (selections[opt.optionName] ?? 0) === valIdx;
                                    return (
                                        <button
                                            key={val.label}
                                            type="button"
                                            onClick={() => selectValue(opt.optionName, valIdx)}
                                            className={`rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] transition-colors ${isSelected
                                                    ? "bg-black text-white"
                                                    : "border border-black/15 text-black/70 hover:border-black/30"
                                                }`}
                                        >
                                            {val.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Price */}
            <div className="flex items-center justify-between">
                <div className="text-base font-semibold">
                    {formatMoney(effectivePrice, product.currency)}
                </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                    type="button"
                    onClick={handleAddToCart}
                    className="rounded-full bg-black px-6 py-3 text-xs font-medium uppercase tracking-[0.22em] text-white hover:bg-black/90"
                >
                    Add to cart
                </button>
                <a
                    href="/cart"
                    className="rounded-full border border-black/15 px-6 py-3 text-xs font-medium uppercase tracking-[0.22em] text-black/80 hover:border-black/30"
                >
                    View cart
                </a>
            </div>
        </div>
    );
}
