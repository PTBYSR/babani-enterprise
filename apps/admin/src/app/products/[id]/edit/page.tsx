import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { connectToDatabase, ProductModel } from "@babani/db";
import type { Product } from "@/lib/types";

function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");
  return uri;
}

async function saveUploadedFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const uploadsDir = path.join(process.cwd(), "..", "store", "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), buffer);
  return `/uploads/${filename}`;
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await connectToDatabase(getMongoUri());
  const doc = await ProductModel.findById(id);
  if (!doc) notFound();

  const product = JSON.parse(JSON.stringify(doc)) as Product;
  const existingImages = product.images ?? (product.image?.url ? [{ url: product.image.url }] : []);

  async function updateProduct(formData: FormData) {
    "use server";

    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const price = Number(formData.get("price") ?? 0);

    // Start with existing images that are being kept
    const keptUrls = formData.getAll("keepImage") as string[];
    const images: { url: string }[] = keptUrls.map((url) => ({ url }));

    // Add newly uploaded images
    const imageFiles = formData.getAll("images") as File[];
    for (const file of imageFiles) {
      if (file && file.size > 0 && images.length < 3) {
        const url = await saveUploadedFile(file);
        images.push({ url });
      }
    }

    await connectToDatabase(getMongoUri());
    await ProductModel.findByIdAndUpdate(id, { name, description, price, images }, { runValidators: true });

    redirect("/products");
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-black/60">Products</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Edit product</h1>
        </div>
        <Link className="text-xs uppercase tracking-[0.22em] text-black/60 hover:text-black" href="/products">
          Back
        </Link>
      </div>

      <form action={updateProduct} className="mt-10 grid gap-6 rounded-3xl border border-black/10 p-8">
        {/* Title */}
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-black/80">Title</span>
          <input
            name="name"
            defaultValue={product.name}
            className="h-11 rounded-2xl border border-black/15 px-4 focus:border-black/40 focus:outline-none"
            required
          />
        </label>

        {/* Description */}
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-black/80">Description</span>
          <textarea
            name="description"
            defaultValue={product.description}
            className="min-h-32 rounded-2xl border border-black/15 px-4 py-3 focus:border-black/40 focus:outline-none"
            required
          />
        </label>

        {/* Price */}
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-black/80">Price (EUR)</span>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={product.price}
            className="h-11 rounded-2xl border border-black/15 px-4 focus:border-black/40 focus:outline-none"
            required
          />
        </label>

        {/* Existing images */}
        {existingImages.length > 0 && (
          <div className="grid gap-3 text-sm">
            <span className="font-medium text-black/80">Current images</span>
            <div className="flex flex-wrap gap-3">
              {existingImages.map((img, i) => {
                let valid = false;
                try { new URL(img.url, "http://localhost"); valid = true; } catch { }
                return (
                  <label key={i} className="relative cursor-pointer group">
                    <input type="hidden" name="keepImage" value={img.url} />
                    <div className="h-20 w-20 overflow-hidden rounded-2xl border border-black/10 bg-black/[0.03]">
                      {valid ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img.url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-black/30">No img</div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
            <p className="text-xs text-black/40">Upload new images below to replace or add (max 3 total)</p>
          </div>
        )}

        {/* Upload new images */}
        <div className="grid gap-3 text-sm">
          <span className="font-medium text-black/80">
            {existingImages.length > 0 ? "Replace / add images" : "Images"}
            <span className="ml-1 font-normal text-black/40">(up to {3 - Math.min(existingImages.length, 3)} new)</span>
          </span>
          <div className="grid gap-3 rounded-2xl border border-black/10 bg-black/[0.01] p-4">
            {Array.from({ length: Math.max(1, 3 - existingImages.length) }).map((_, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer">
                <span className="w-5 text-right text-xs text-black/40">{existingImages.length + i + 1}.</span>
                <input
                  name="images"
                  type="file"
                  accept="image/*"
                  className="flex-1 text-sm text-black/70 file:mr-3 file:rounded-full file:border-0 file:bg-black file:px-4 file:py-1.5 file:text-xs file:font-medium file:uppercase file:tracking-[0.18em] file:text-white hover:file:bg-black/80"
                />
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="mt-2 inline-flex justify-center rounded-full bg-black px-8 py-3 text-xs font-medium uppercase tracking-[0.22em] text-white hover:bg-black/80 transition-colors"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}
