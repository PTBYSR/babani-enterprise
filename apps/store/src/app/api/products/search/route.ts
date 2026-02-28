import { NextResponse } from "next/server";
import { connectToDatabase, ProductModel } from "@babani/db";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q");

        if (!query) {
            return NextResponse.json({ products: [] });
        }

        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("Missing MONGODB_URI");
        }

        await connectToDatabase(mongoUri);

        // Search by name, brand, or notes (top, heart, base)
        const products = await ProductModel.find({
            isActive: true,
            $or: [
                { name: { $regex: query, $options: "i" } },
                { brand: { $regex: query, $options: "i" } },
                { "notes.top": { $regex: query, $options: "i" } },
                { "notes.heart": { $regex: query, $options: "i" } },
                { "notes.base": { $regex: query, $options: "i" } },
            ],
        })
            .limit(8)
            .select("name price slug image brand")
            .lean();

        return NextResponse.json({ products });
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }
}
