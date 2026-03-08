import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    brand: { type: String, trim: true, default: "Babani" },
    description: { type: String, required: true },
    notes: {
      top: { type: [String], default: [] },
      heart: { type: [String], default: [] },
      base: { type: [String], default: [] }
    },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "NGN" },
    sizeMl: { type: Number, default: 50 },
    concentration: { type: String, default: "Fragrance" },
    image: {
      url: { type: String, default: "" },
      alt: { type: String, default: "" }
    },
    images: {
      type: [{ url: { type: String, required: true } }],
      default: []
    },
    intensity: { type: Number, default: 50, min: 0, max: 100 },
    variants: {
      type: [{
        optionName: { type: String, required: true, trim: true },
        values: {
          type: [{
            label: { type: String, required: true, trim: true },
            price: { type: Number, required: true, min: 0 },
          }],
          default: [],
        },
      }],
      default: [],
    },
    isActive: { type: Boolean, default: true },
    likesCount: { type: Number, default: 0 },
    likedByIps: { type: [String], default: [] },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export type Product = InferSchemaType<typeof ProductSchema> & {
  _id: mongoose.Types.ObjectId;
};

// In dev, always re-register the model so schema changes are picked up on hot reload
if (process.env.NODE_ENV !== "production" && mongoose.models.Product) {
  delete (mongoose.models as Record<string, unknown>)["Product"];
}

export const ProductModel: Model<Product> =
  (mongoose.models.Product as Model<Product>) ||
  mongoose.model<Product>("Product", ProductSchema);
