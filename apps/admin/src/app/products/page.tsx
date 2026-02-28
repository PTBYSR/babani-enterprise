import Link from "next/link";

import { revalidatePath } from "next/cache";
import { connectToDatabase, ProductModel } from "@babani/db";
import type { Product } from "@/lib/types";

function getMongoUri() {
  return process.env.MONGODB_URI;
}

async function getProducts(): Promise<Product[]> {
  const uri = getMongoUri();
  if (!uri) {
    console.warn("MONGODB_URI is missing. Skipping database connection during build.");
    return [];
  }
  await connectToDatabase(uri);
  const docs = await ProductModel.find({}).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(docs)) as Product[];
}

export default async function ProductsPage() {
  const products = await getProducts();

  async function deleteProduct(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "");

    const uri = getMongoUri();
    if (!uri) {
      console.error("MONGODB_URI is missing. Cannot delete product.");
      return;
    }
    await connectToDatabase(uri);
    await ProductModel.findByIdAndDelete(id);

    revalidatePath("/products");
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-black/60">Admin</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Products</h1>
        </div>
        <Link
          href="/products/new"
          className="rounded-full bg-black px-6 py-3 text-xs font-medium uppercase tracking-[0.22em] text-white hover:bg-black/90"
        >
          Add product
        </Link>
      </div>

      <div className="mt-10 overflow-hidden rounded-3xl border border-black/10">
        <div className="grid grid-cols-[96px_1fr_160px_220px] gap-4 border-b border-black/10 bg-black/[0.02] px-6 py-4 text-[11px] uppercase tracking-[0.22em] text-black/60">
          <div>Image</div>
          <div>Product</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>
        <div className="divide-y divide-black/10">
          {products.map((p) => {
            const imgUrl = p.images?.[0]?.url ?? p.image?.url ?? "";
            const validImage = imgUrl.startsWith("/") || (() => { try { new URL(imgUrl); return true; } catch { return false; } })();
            return (
              <div key={p._id} className="grid grid-cols-[96px_1fr_160px_220px] items-center gap-4 px-6 py-4">
                <div className="h-16 w-16 overflow-hidden rounded-2xl bg-black/[0.03]">
                  {validImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imgUrl} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-black/30">No img</div>
                  )}
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-black/60">{p.brand}</div>
                  <div className="mt-1 text-sm font-medium">{p.name}</div>
                  <div className="mt-1 text-xs text-black/50">/{p.slug}</div>
                </div>
                <div className="text-xs uppercase tracking-[0.22em] text-black/60">
                  {p.isActive ? "Active" : "Hidden"}
                </div>
                <div className="flex items-center justify-end gap-3">
                  <Link
                    href={`/products/${p._id}/edit`}
                    className="rounded-full border border-black/15 px-4 py-2 text-xs uppercase tracking-[0.22em] text-black/70 hover:border-black/30"
                  >
                    Edit
                  </Link>
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={p._id} />
                    <button
                      type="submit"
                      className="rounded-full border border-black/15 px-4 py-2 text-xs uppercase tracking-[0.22em] text-black/70 hover:border-black/30"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
