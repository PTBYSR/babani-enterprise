import { NextResponse } from "next/server";
import { connectToDatabase, ProductModel, ReviewModel } from "@babani/db";
import { headers } from "next/headers";
import mongoose from "mongoose";

function getMongoUri() {
    return process.env.MONGODB_URI || process.env.MONGO_URI;
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const body = await request.json();
        const { rating } = body;

        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
            return NextResponse.json({ error: "Invalid rating value" }, { status: 400 });
        }

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

        // Check if the user already rated
        const existingReview = await ReviewModel.findOne({ productId: id, ipAddress: ip });

        if (existingReview) {
            // User is updating their rating
            existingReview.rating = rating;
            await existingReview.save();
        } else {
            // User is rating for the first time
            await ReviewModel.create({
                productId: id,
                ipAddress: ip,
                rating
            });
        }

        // Recalculate aggregates from the source of truth (ReviewModel)
        const stats = await ReviewModel.aggregate([
            { $match: { productId: new mongoose.Types.ObjectId(id) } },
            {
                $group: {
                    _id: "$productId",
                    avgRating: { $avg: "$rating" },
                    totalCount: { $sum: 1 }
                }
            }
        ]);

        if (stats.length > 0) {
            const { avgRating, totalCount } = stats[0];
            const roundedAvg = Math.round(avgRating * 10) / 10;

            product.averageRating = roundedAvg;
            product.totalReviews = totalCount;
            await product.save();

            return NextResponse.json({
                success: true,
                action: existingReview ? "updated" : "created",
                newAverage: roundedAvg,
                count: totalCount
            });
        }

        return NextResponse.json({ success: true, action: "none", newAverage: 0, count: 0 });


    } catch (error) {
        console.error("Error submitting rating:", error);
        return NextResponse.json({ error: "Failed to submit rating" }, { status: 500 });
    }
}
