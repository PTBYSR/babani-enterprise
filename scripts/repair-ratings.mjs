import mongoose from "mongoose";

// Minimal schemas for the script
const ProductSchema = new mongoose.Schema({
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
}, { strict: false });

const ReviewSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    rating: { type: Number }
}, { strict: false });

const MONGO_URI = "mongodb+srv://ricktierwilson_db_user:ricktierwilson_db_user@cluster0.c669rej.mongodb.net/test?retryWrites=true&w=majority";

async function repair() {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected.");

    const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
    const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

    const products = await Product.find({});
    console.log(`Found ${products.length} products. Starting repair...`);

    for (const product of products) {
        // Aggregate reviews for this product
        const stats = await Review.aggregate([
            { $match: { productId: product._id } },
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

            console.log(`Updating ${product.name || product._id}: ${totalCount} reviews, ${roundedAvg} average.`);

            product.averageRating = roundedAvg;
            product.totalReviews = totalCount;
            await product.save();
        } else {
            // Reset to 0 if no reviews exist
            if (product.averageRating !== 0 || product.totalReviews !== 0) {
                console.log(`Resetting ${product.name || product._id}: 0 reviews.`);
                product.averageRating = 0;
                product.totalReviews = 0;
                await product.save();
            }
        }
    }

    console.log("Repair completed successfully.");
    await mongoose.disconnect();
}

repair().catch(err => {
    console.error("Repair failed:", err);
    process.exit(1);
});
