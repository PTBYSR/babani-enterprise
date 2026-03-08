"use client";

import { useState } from "react";

export type VariantOption = {
    optionName: string;
    values: { label: string; price: number }[];
};

interface VariantsEditorProps {
    initialVariants?: VariantOption[];
}

export function VariantsEditor({ initialVariants = [] }: VariantsEditorProps) {
    const [options, setOptions] = useState<VariantOption[]>(initialVariants);
    const [editingIdx, setEditingIdx] = useState<number | null>(
        initialVariants.length > 0 ? null : null
    );

    function addOption() {
        const newIdx = options.length;
        setOptions([...options, { optionName: "", values: [] }]);
        setEditingIdx(newIdx);
    }

    function removeOption(idx: number) {
        setOptions(options.filter((_, i) => i !== idx));
        setEditingIdx(null);
    }

    function updateOptionName(idx: number, name: string) {
        setOptions(options.map((o, i) => (i === idx ? { ...o, optionName: name } : o)));
    }

    function addValue(idx: number) {
        setOptions(
            options.map((o, i) =>
                i === idx ? { ...o, values: [...o.values, { label: "", price: 0 }] } : o
            )
        );
    }

    function updateValueLabel(optIdx: number, valIdx: number, label: string) {
        setOptions(
            options.map((o, i) =>
                i === optIdx
                    ? {
                        ...o,
                        values: o.values.map((v, j) => (j === valIdx ? { ...v, label } : v)),
                    }
                    : o
            )
        );
    }

    function updateValuePrice(optIdx: number, valIdx: number, price: number) {
        setOptions(
            options.map((o, i) =>
                i === optIdx
                    ? {
                        ...o,
                        values: o.values.map((v, j) => (j === valIdx ? { ...v, price } : v)),
                    }
                    : o
            )
        );
    }

    function removeValue(optIdx: number, valIdx: number) {
        setOptions(
            options.map((o, i) =>
                i === optIdx
                    ? { ...o, values: o.values.filter((_, j) => j !== valIdx) }
                    : o
            )
        );
    }

    // Serialise the non-empty options into the hidden input
    const cleanOptions = options
        .filter((o) => o.optionName.trim() !== "")
        .map((o) => ({
            optionName: o.optionName.trim(),
            values: o.values
                .filter((v) => v.label.trim() !== "")
                .map((v) => ({ label: v.label.trim(), price: v.price })),
        }));

    return (
        <div className="grid gap-4 text-sm">
            <span className="font-medium text-black/80">Variants</span>

            {/* Hidden input to send JSON to server action */}
            <input type="hidden" name="variants" value={JSON.stringify(cleanOptions)} />

            <div className="rounded-2xl border border-black/10 bg-black/[0.01] p-4">
                {options.map((opt, optIdx) => (
                    <div
                        key={optIdx}
                        className="mb-4 last:mb-0 rounded-2xl border border-black/10 bg-white p-4"
                    >
                        {editingIdx === optIdx ? (
                            /* ─── Editing mode ─── */
                            <div className="grid gap-4">
                                {/* Option name */}
                                <div className="grid gap-1">
                                    <label className="text-xs font-medium text-black/60">
                                        Option name
                                    </label>
                                    <input
                                        type="text"
                                        value={opt.optionName}
                                        onChange={(e) => updateOptionName(optIdx, e.target.value)}
                                        placeholder="e.g. Size"
                                        className="h-10 rounded-xl border border-black/15 px-3 text-sm focus:border-black/40 focus:outline-none"
                                    />
                                </div>

                                {/* Option values */}
                                <div className="grid gap-1">
                                    <label className="text-xs font-medium text-black/60">
                                        Option values
                                    </label>
                                    <div className="grid gap-2">
                                        {opt.values.map((val, valIdx) => (
                                            <div key={valIdx} className="flex flex-wrap items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={val.label}
                                                    onChange={(e) =>
                                                        updateValueLabel(optIdx, valIdx, e.target.value)
                                                    }
                                                    placeholder="e.g. Medium"
                                                    className="h-10 flex-1 min-w-[120px] rounded-xl border border-black/15 px-3 text-sm focus:border-black/40 focus:outline-none"
                                                />
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={val.price || ""}
                                                    onChange={(e) =>
                                                        updateValuePrice(
                                                            optIdx,
                                                            valIdx,
                                                            parseFloat(e.target.value) || 0
                                                        )
                                                    }
                                                    placeholder="Price"
                                                    className="h-10 w-full sm:w-28 rounded-xl border border-black/15 px-3 text-sm focus:border-black/40 focus:outline-none"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeValue(optIdx, valIdx)}
                                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/10 text-black/40 hover:border-black/30 hover:text-black/70"
                                                    title="Remove value"
                                                >
                                                    🗑
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => addValue(optIdx)}
                                        className="mt-1 h-10 rounded-xl border border-dashed border-black/15 px-3 text-xs text-black/50 hover:border-black/30 hover:text-black/70"
                                    >
                                        Add another value
                                    </button>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between pt-2">
                                    <button
                                        type="button"
                                        onClick={() => removeOption(optIdx)}
                                        className="rounded-full border border-black/15 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-red-600 hover:border-red-300"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingIdx(null)}
                                        className="rounded-full bg-black px-5 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white hover:bg-black/80"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* ─── Collapsed mode ─── */
                            <button
                                type="button"
                                onClick={() => setEditingIdx(optIdx)}
                                className="flex w-full items-center justify-between text-left"
                            >
                                <div>
                                    <div className="font-medium">
                                        {opt.optionName || "Untitled option"}
                                    </div>
                                    <div className="mt-1 text-xs text-black/50">
                                        {opt.values.length > 0
                                            ? opt.values.map((v) => v.label).join(", ")
                                            : "No values"}
                                    </div>
                                </div>
                                <span className="text-xs text-black/40">Edit</span>
                            </button>
                        )}
                    </div>
                ))}

                {/* Add option button */}
                <button
                    type="button"
                    onClick={addOption}
                    className="flex items-center gap-2 text-sm text-black/60 hover:text-black"
                >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-black/20 text-xs">
                        +
                    </span>
                    Add options like size or color
                </button>
            </div>

            {/* Summary table */}
            {cleanOptions.some((o) => o.values.length > 0) && (
                <div className="rounded-2xl border border-black/10 overflow-hidden">
                    <div className="grid grid-cols-[1fr_120px] gap-4 border-b border-black/10 bg-black/[0.02] px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-black/60">
                        <div>Variant</div>
                        <div className="text-right">Price (NGN)</div>
                    </div>
                    <div className="divide-y divide-black/10">
                        {cleanOptions.flatMap((opt) =>
                            opt.values.map((val) => (
                                <div
                                    key={`${opt.optionName}-${val.label}`}
                                    className="grid grid-cols-[1fr_120px] gap-4 px-4 py-3"
                                >
                                    <div className="text-sm">
                                        <span className="text-black/50">{opt.optionName}:</span>{" "}
                                        {val.label}
                                    </div>
                                    <div className="text-right text-sm font-medium">
                                        {val.price.toLocaleString("en-NG", {
                                            minimumFractionDigits: 2,
                                        })}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
