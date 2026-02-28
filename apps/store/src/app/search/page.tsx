import { connectToDatabase, ProductModel } from "@babani/db";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/types";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";

async function searchProducts(query: string): Promise<Product[]> {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) throw new Error("Missing MONGODB_URI");

    await connectToDatabase(mongoUri);

    const docs = await ProductModel.find({
        isActive: true,
        $or: [
            { name: { $regex: query, $options: "i" } },
            { brand: { $regex: query, $options: "i" } },
            { "notes.top": { $regex: query, $options: "i" } },
            { "notes.heart": { $regex: query, $options: "i" } },
            { "notes.base": { $regex: query, $options: "i" } },
        ],
    }).sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(docs)) as Product[];
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q: query } = await searchParams;

    if (!query) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
                <div className="rounded-full bg-black/5 p-6">
                    <SearchIcon size={40} className="text-black/20" />
                </div>
                <h1 className="text-2xl font-semibold">Start searching</h1>
                <p className="max-w-xs text-sm text-black/60">
                    Enter a fragrance name, brand, or note to find what you're looking for.
                </p>
                <Link
                    href="/"
                    className="mt-4 rounded-full bg-black px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-transform active:scale-95"
                >
                    Back to Shop
                </Link>
            </div>
        );
    }

    const products = await searchProducts(query);

    return (
        <div>
            <div className="flex flex-col gap-3">
                <div className="text-xs uppercase tracking-[0.22em] text-black/60">Search Results</div>
                <h1 className="text-3xl font-semibold tracking-tight">
                    {products.length} {products.length === 1 ? "result" : "results"} for "{query}"
                </h1>
                {products.length === 0 && (
                    <p className="max-w-2xl text-sm leading-7 text-black/60">
                        We couldn't find anything matching your search. Try different keywords or browse our
                        collections.
                    </p>
                )}
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p) => (
                    <ProductCard key={p._id} product={p} />
                ))}
            </div>

            {products.length === 0 && (
                <div className="mt-10 flex flex-col items-center justify-center gap-4 py-20 border-t border-black/5">
                    <Link
                        href="/"
                        className="rounded-full border border-black/10 px-8 py-4 text-xs font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all"
                    >
                        Explore All Fragrances
                    </Link>
                </div>
            )}
        </div>
    );
}
