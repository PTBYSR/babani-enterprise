import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ReviewSchema = new Schema(
    {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
        ipAddress: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 }
    },
    { timestamps: true }
);

export type Review = InferSchemaType<typeof ReviewSchema> & {
    _id: mongoose.Types.ObjectId;
};

if (process.env.NODE_ENV !== "production" && mongoose.models.Review) {
    delete (mongoose.models as Record<string, unknown>)["Review"];
}

export const ReviewModel: Model<Review> =
    (mongoose.models.Review as Model<Review>) ||
    mongoose.model<Review>("Review", ReviewSchema);
