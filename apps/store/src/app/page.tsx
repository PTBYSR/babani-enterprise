import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/types";
import { connectToDatabase, ProductModel } from "@babani/db";

function getMongoUri() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error("Missing MONGODB_URI (or MONGO_URI)");
  return uri;
}

async function getProducts(): Promise<Product[]> {
  await connectToDatabase(getMongoUri());
  const docs = await ProductModel.find({ isActive: true }).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(docs)) as Product[];
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex flex-col gap-3">
        <div className="text-xs uppercase tracking-[0.22em] text-black/60">Fine Fragrance</div>
        <h1 className="text-3xl font-semibold tracking-tight">Quiet luxury, bottled.</h1>
        <p className="max-w-2xl text-sm leading-7 text-black/60">
          Discover a curated selection of premium perfumes designed with restraint, precision, and lasting character.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}
