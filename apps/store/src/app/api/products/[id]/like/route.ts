import { NextResponse } from "next/server";
import { connectToDatabase, ProductModel } from "@babani/db";
import { headers } from "next/headers";

function getMongoUri() {
    return process.env.MONGODB_URI || process.env.MONGO_URI;
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const uri = getMongoUri();
        if (!uri) throw new Error("No database connection string");

        await connectToDatabase(uri);

        // Try to get IP address to prevent spam. Fallback if undefined.
        const headersList = await headers();
        const forwardedFor = headersList.get("x-forwarded-for");
        const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown-ip";

        const product = await ProductModel.findById(id);
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const likedByIps = product.likedByIps || [];
        const hasLiked = likedByIps.includes(ip);

        if (hasLiked) {
            // User is un-liking the product
            await ProductModel.updateOne(
                { _id: id },
                {
                    $pull: { likedByIps: ip },
                    $inc: { likesCount: -1 }
                }
            );
            return NextResponse.json({ success: true, action: "unliked" });
        } else {
            // User is liking the product
            await ProductModel.updateOne(
                { _id: id },
                {
                    $push: { likedByIps: ip },
                    $inc: { likesCount: 1 }
                }
            );
            return NextResponse.json({ success: true, action: "liked" });
        }

    } catch (error: any) {
        console.error("Error toggling like:", error);
        return NextResponse.json({ error: "Failed to toggle like", details: error.message }, { status: 500 });
    }
}
