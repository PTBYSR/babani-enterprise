import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    brand: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    notes: {
      top: { type: [String], default: [] },
      heart: { type: [String], default: [] },
      base: { type: [String], default: [] }
    },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "EUR" },
    sizeMl: { type: Number, required: true, min: 1 },
    concentration: { type: String, required: true },
    image: {
      url: { type: String, required: true },
      alt: { type: String, required: true }
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

async function main() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI (or MONGO_URI)");
  }

  await mongoose.connect(uri);

  const products = await Product.find({}).sort({ createdAt: -1 }).lean();

  console.log(`Found ${products.length} products`);
  for (const p of products) {
    console.log(`- ${p.name} (${p.slug}) | ${p.currency} ${p.price} | active=${p.isActive}`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
